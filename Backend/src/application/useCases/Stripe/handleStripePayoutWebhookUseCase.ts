import { TransactionStatus } from "@domain/enum/transactionStatus";
import {
  IHandleStripePayoutWebhookUseCase,
  PayoutWebhookEvent,
} from "@domain/interfaces/useCases/stripe/IHandleStripePayoutWebhookUseCase";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";

export class HandleStripePayoutWebhookUseCase implements IHandleStripePayoutWebhookUseCase {
  constructor(
    private _transactionRepo: ITransactionRepository,
    private _walletRepo: IWalletRepository,
    private _unitOfWork: IUnitOfWork
  ) {}

  async execute(event: PayoutWebhookEvent): Promise<void> {
    const { type, transferId } = event;

    const transaction = await this._transactionRepo.findByRelatedPaymentId(transferId);

    if (!transaction) return;

    if (type === "SUCCESS") {
      if (transaction.status === TransactionStatus.SUCCESS) return;

      await this._unitOfWork.start();
      const session = this._unitOfWork.getSession();

      try {
        await this._transactionRepo.updateStatus(
          transaction._id!,
          TransactionStatus.SUCCESS,
          session
        );

        await this._walletRepo.decrementBalance(
          transaction.fromWalletId!,
          transaction.amount,
          session
        );

        await this._unitOfWork.commit();
      } catch (err) {
        await this._unitOfWork.rollback();
        throw err;
      }
    }

    if (type === "FAILED") {
      if (transaction.status === TransactionStatus.FAILED) return;

      await this._transactionRepo.updateStatus(transaction._id!, TransactionStatus.FAILED);
    }
  }
}
