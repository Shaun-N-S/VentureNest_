import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IStripeConnectService } from "@domain/interfaces/services/IStripeConnectService";
import { IWithdrawToBankUseCase } from "@domain/interfaces/useCases/stripe/IWithdrawToBankUseCase";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";
import { Errors, STRIPE_ERRORS, USER_ERRORS, WALLET_ERRORS } from "@shared/constants/error";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";
import { WithdrawToBankDTO } from "application/dto/stripe/stripeDTO";

export class WithdrawToBankUseCase implements IWithdrawToBankUseCase {
  constructor(
    private _walletRepo: IWalletRepository,
    private _userRepo: IUserRepository,
    private _transactionRepo: ITransactionRepository,
    private _stripeService: IStripeConnectService,
    private _unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string, dto: WithdrawToBankDTO) {
    const { amount } = dto;

    if (!amount || amount <= 0) {
      throw new InvalidDataException(Errors.INVALID_AMOUNT);
    }

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);
    }

    if (!user.stripeAccountId || !user.stripeOnboardingComplete) {
      throw new InvalidDataException(STRIPE_ERRORS.NOT_ONBOARDED);
    }

    const ownerType = user.role === "INVESTOR" ? WalletOwnerType.INVESTOR : WalletOwnerType.USER;

    const wallet = await this._walletRepo.findByOwner(ownerType, userId);

    if (!wallet) {
      throw new NotFoundExecption(WALLET_ERRORS.NOT_FOUND);
    }

    const available = wallet.balance - wallet.lockedBalance;

    if (available < amount) {
      throw new InvalidDataException(WALLET_ERRORS.INSUFFICIENT_BALANCE);
    }

    let transferId: string;

    try {
      const result = await this._stripeService.createPayout(user.stripeAccountId, amount, {
        userId,
        walletId: wallet._id!,
        type: "WITHDRAWAL",
      });

      transferId = result.transferId;
    } catch {
      throw new InvalidDataException(STRIPE_ERRORS.STRIPE_PAYOUT_FAILED);
    }

    await this._unitOfWork.start();
    const session = this._unitOfWork.getSession();

    try {
      await this._transactionRepo.save(
        {
          fromWalletId: wallet._id!,
          amount,
          action: TransactionAction.DEBIT,
          reason: TransactionReason.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          relatedPaymentId: transferId,
          createdAt: new Date(),
        },
        session
      );

      await this._unitOfWork.commit();
    } catch (err) {
      await this._unitOfWork.rollback();
      throw err;
    }

    return { success: true };
  }
}
