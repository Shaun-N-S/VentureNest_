import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { UserRole } from "@domain/enum/userRole";

export interface IPaymentService {
  createCheckoutSession(data: {
    ownerId: string;
    ownerRole: UserRole;

    planId?: string;
    durationDays?: number;

    planName: string;
    description: string;
    amount: number;

    purpose: PaymentPurpose;
  }): Promise<string>;
}
