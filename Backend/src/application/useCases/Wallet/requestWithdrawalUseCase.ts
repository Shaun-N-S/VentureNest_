import { IRequestWithdrawalUseCase } from "@domain/interfaces/useCases/wallet/IRequestWithdrawalUseCase";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IWithdrawalRepository } from "@domain/interfaces/repositories/IWithdrawalRepository";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { WithdrawalMapper } from "application/mappers/withdrawalMapper";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";
import { WALLET_ERRORS } from "@shared/constants/error";
import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";
import { RequestWithdrawalDTO } from "application/dto/wallet/withdrawalDTO";

export class RequestWithdrawalUseCase implements IRequestWithdrawalUseCase {
  constructor(
    private _walletRepo: IWalletRepository,
    private _projectRepo: IProjectRepository,
    private _withdrawalRepo: IWithdrawalRepository,
    private _unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string, dto: RequestWithdrawalDTO) {
    const { projectId, amount, reason } = dto;

    if (!reason || reason.trim().length < 3) {
      throw new InvalidDataException(WALLET_ERRORS.WITHDRAWAL_REASON_TOO_SHORT);
    }

    if (!amount || amount <= 0) {
      throw new InvalidDataException(WALLET_ERRORS.WITHDRAWAL_AMOUNT_INVALID);
    }

    const project = await this._projectRepo.findById(projectId);

    if (!project || project.userId !== userId) {
      throw new InvalidDataException(WALLET_ERRORS.WITHDRAWAL_UNAUTHORIZED_ACCESS);
    }

    const wallet = await this._walletRepo.findByOwner(WalletOwnerType.PROJECT, projectId);

    if (!wallet) throw new NotFoundExecption(WALLET_ERRORS.NOT_FOUND);

    const availableBalance = wallet.balance - wallet.lockedBalance;

    if (availableBalance < amount) {
      throw new InvalidDataException(WALLET_ERRORS.WITHDRAWAL_INSUFFICIENT_BALANCE);
    }

    await this._unitOfWork.start();
    const session = this._unitOfWork.getSession();

    try {
      // LOCK MONEY
      await this._walletRepo.decrementBalance(wallet._id!, amount, session);
      await this._walletRepo.incrementLockedBalance(wallet._id!, amount, session);

      const withdrawal = await this._withdrawalRepo.save(
        {
          projectId,
          walletId: wallet._id!,
          amount,
          reason,
          status: WithdrawalStatus.PENDING,
          createdAt: new Date(),
        },
        session
      );

      await this._unitOfWork.commit();

      return WithdrawalMapper.toResponseDTO(withdrawal);
    } catch (error) {
      await this._unitOfWork.rollback();
      throw error;
    }
  }
}
