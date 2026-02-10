import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
import { TransactionStatus } from "@domain/enum/transactionStatus";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { UserRole } from "@domain/enum/userRole";
import { PaymentEntity } from "@domain/entities/payment/paymentEntity";

export class HandleWalletTopupCompletedUseCase {
  constructor(
    private _walletRepo: IWalletRepository,
    private _paymentRepo: IPaymentRepository,
    private _transactionRepo: ITransactionRepository
  ) {}

  async execute(data: { sessionId: string; ownerId: string; ownerRole: UserRole; amount: number }) {
    const existing = await this._paymentRepo.findBySessionId(data.sessionId);
    if (existing) return;

    const wallet = await this._walletRepo.findByOwner(
      data.ownerRole === UserRole.INVESTOR ? WalletOwnerType.INVESTOR : WalletOwnerType.USER,
      data.ownerId
    );

    if (!wallet) return;

    await this._walletRepo.incrementBalance(wallet._id!, data.amount);

    await this._transactionRepo.save({
      toWalletId: wallet._id!,
      amount: data.amount,
      action: TransactionAction.CREDIT,
      reason: TransactionReason.WALLET_TOPUP,
      status: TransactionStatus.SUCCESS,
      createdAt: new Date(),
    });

    await this._paymentRepo.save({
      sessionId: data.sessionId,
      ownerId: data.ownerId,
      ownerRole: data.ownerRole,
      amount: data.amount,
      purpose: PaymentPurpose.WALLET_TOPUP,
      createdAt: new Date(),
    } as PaymentEntity);
  }
}
