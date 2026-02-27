import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";
import { TransactionStatus } from "@domain/enum/transactionStatus";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
import { UserRole } from "@domain/enum/userRole";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IHandleCheckoutCompletedUseCase } from "@domain/interfaces/useCases/payment/IHandleCheckoutCompletedUseCase";

export class HandleCheckoutCompletedUseCase implements IHandleCheckoutCompletedUseCase {
  constructor(
    private _paymentRepo: IPaymentRepository,
    private _subscriptionRepo: ISubscriptionRepository,
    private _planRepo: IPlanRepository,
    private _transactionRepo: ITransactionRepository,
    private _walletRepo: IWalletRepository,
    private _userRepo: IUserRepository
  ) {}

  async execute(data: {
    sessionId: string;
    ownerId: string;
    ownerRole: UserRole;
    planId: string;
    durationDays: number;
  }): Promise<void> {
    const existingPayment = await this._paymentRepo.findBySessionId(data.sessionId);
    if (existingPayment) return;

    const plan = await this._planRepo.findById(data.planId);
    if (!plan) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + data.durationDays);

    await this._subscriptionRepo.save({
      ownerId: data.ownerId,
      ownerRole: data.ownerRole,
      planId: data.planId,
      startedAt: startDate,
      expiresAt: endDate,
      status: SubscriptionStatus.ACTIVE,
      createdAt: new Date(),
    });

    await this._paymentRepo.save({
      sessionId: data.sessionId,
      ownerId: data.ownerId,
      ownerRole: data.ownerRole,
      planId: data.planId,
      purpose: PaymentPurpose.SUBSCRIPTION,
      amount: plan.billing.price,
      createdAt: new Date(),
    });

    const admin = await this._userRepo.findByRole(UserRole.ADMIN);
    if (!admin) return;

    const platformWallet = await this._walletRepo.findByOwner(WalletOwnerType.PLATFORM, admin._id!);

    if (!platformWallet) return;

    await this._walletRepo.incrementBalance(platformWallet._id!, plan.billing.price);

    await this._transactionRepo.save({
      toWalletId: platformWallet._id!,
      amount: plan.billing.price,
      action: TransactionAction.CREDIT,
      reason: TransactionReason.SUBSCRIPTION,
      status: TransactionStatus.SUCCESS,
      createdAt: new Date(),
    });
  }
}
