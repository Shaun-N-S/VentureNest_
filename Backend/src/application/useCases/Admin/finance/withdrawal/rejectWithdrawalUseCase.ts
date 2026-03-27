import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IWithdrawalRepository } from "@domain/interfaces/repositories/IWithdrawalRepository";
import { IRejectWithdrawalUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IRejectWithdrawalUseCase";
import { WALLET_ERRORS } from "@shared/constants/error";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";

export class RejectWithdrawalUseCase implements IRejectWithdrawalUseCase {
  constructor(
    private _withdrawalRepo: IWithdrawalRepository,
    private _walletRepo: IWalletRepository,
    private _unitOfWork: IUnitOfWork
  ) {}

  async execute(withdrawalId: string, reason: string) {
    const withdrawal = await this._withdrawalRepo.findById(withdrawalId);

    if (!withdrawal) throw new NotFoundExecption(WALLET_ERRORS.WITHDRAWAL_NOT_FOUND);

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new InvalidDataException(WALLET_ERRORS.WITHDRAWAL_ALREADY_PROCESSED);
    }

    await this._unitOfWork.start();
    const session = this._unitOfWork.getSession();

    try {
      const wallet = await this._walletRepo.findByOwner(
        WalletOwnerType.PROJECT,
        withdrawal.projectId
      );

      // UNLOCK
      await this._walletRepo.decrementLockedBalance(wallet!._id!, withdrawal.amount, session);

      // REFUND
      await this._walletRepo.incrementBalance(wallet!._id!, withdrawal.amount, session);

      await this._withdrawalRepo.update(
        withdrawalId,
        {
          status: WithdrawalStatus.REJECTED,
          rejectionReason: reason,
          processedAt: new Date(),
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
