import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { PlanStatus } from "@domain/enum/planStatus";
import { UserRole } from "@domain/enum/userRole";
import { IPlanRepository } from "@domain/interfaces/repositories/IPlanRepository";
import { IPaymentService } from "@domain/interfaces/services/IPaymentService";
import { ICreateCheckoutSessionUseCase } from "@domain/interfaces/useCases/payment/ICreateCheckoutSessionUseCase";
import { PLAN_ERRORS } from "@shared/constants/error";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
  constructor(
    private _planRepo: IPlanRepository,
    private _paymentService: IPaymentService
  ) {}

  async execute(ownerId: string, ownerRole: UserRole, planId: string): Promise<string> {
    const plan = await this._planRepo.findById(planId);

    if (!plan) throw new NotFoundExecption(PLAN_ERRORS.PLAN_NOT_FOUND);
    if (plan.status !== PlanStatus.ACTIVE) throw new ForbiddenException(PLAN_ERRORS.INACTIVE_PLAN);

    return this._paymentService.createCheckoutSession({
      ownerId,
      ownerRole,
      amount: plan.billing.price,
      purpose: PaymentPurpose.SUBSCRIPTION,
      planName: plan.name,
      description: plan.description,
      metadata: {
        planId: plan._id!,
        durationDays: plan.billing.durationDays.toString(),
      },
    });
  }
}
