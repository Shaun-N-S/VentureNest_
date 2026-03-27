import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IWithdrawalRepository } from "@domain/interfaces/repositories/IWithdrawalRepository";
import { IApproveWithdrawalUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IApproveWithdrawalUseCase";
import { WALLET_ERRORS } from "@shared/constants/error";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";

export class ApproveWithdrawalUseCase implements IApproveWithdrawalUseCase {
  constructor(
    private _walletRepo: IWalletRepository,
    private _projectRepo: IProjectRepository,
    private _withdrawalRepo: IWithdrawalRepository,
    private _transactionRepo: ITransactionRepository,
    private _unitOfWork: IUnitOfWork
  ) {}

  async execute(withdrawalId: string) {
    const withdrawal = await this._withdrawalRepo.findById(withdrawalId);

    if (!withdrawal) throw new NotFoundExecption(WALLET_ERRORS.WITHDRAWAL_NOT_FOUND);

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new InvalidDataException(WALLET_ERRORS.WITHDRAWAL_ALREADY_PROCESSED);
    }

    await this._unitOfWork.start();
    const session = this._unitOfWork.getSession();

    try {
      const projectWallet = await this._walletRepo.findByOwner(
        WalletOwnerType.PROJECT,
        withdrawal.projectId
      );

      const project = await this._projectRepo.findById(withdrawal.projectId);

      const userWallet = await this._walletRepo.findByOwner(WalletOwnerType.USER, project!.userId);

      // UNLOCK
      await this._walletRepo.decrementLockedBalance(
        projectWallet!._id!,
        withdrawal.amount,
        session
      );

      // TRANSFER
      await this._walletRepo.incrementBalance(userWallet!._id!, withdrawal.amount, session);

      // UPDATE STATUS
      await this._withdrawalRepo.update(
        withdrawalId,
        {
          status: WithdrawalStatus.APPROVED,
          processedAt: new Date(),
        },
        session
      );

      // CREATE TRANSACTION
      await this._transactionRepo.save(
        {
          fromWalletId: projectWallet!._id!,
          toWalletId: userWallet!._id!,
          amount: withdrawal.amount,
          action: TransactionAction.TRANSFER,
          reason: TransactionReason.WITHDRAWAL,
          status: TransactionStatus.SUCCESS,
          createdAt: new Date(),
        },
        session
      );

      await this._unitOfWork.commit();
    } catch (err) {
      await this._unitOfWork.rollback();
      throw err;
    }
  }
}
