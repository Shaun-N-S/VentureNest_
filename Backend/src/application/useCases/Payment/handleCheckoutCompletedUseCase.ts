import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";
import { UserRole } from "@domain/enum/userRole";
import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { IHandleCheckoutCompletedUseCase } from "@domain/interfaces/useCases/payment/IHandleCheckoutCompletedUseCase";

export class HandleCheckoutCompletedUseCase implements IHandleCheckoutCompletedUseCase {
  constructor(
    private _paymentRepo: IPaymentRepository,
    private _subscriptionRepo: ISubscriptionRepository,
    private _planRepo: IPlanRepository
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
      amount: plan.billing.price,
      createdAt: new Date(),
    });
  }
}
