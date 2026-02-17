import { PaymentPurpose } from "@domain/enum/paymentPurpose";
import { UserRole } from "@domain/enum/userRole";

export interface IPaymentService {
  createCheckoutSession(data: {
    ownerId: string;
    ownerRole: UserRole;

    amount: number;
    purpose: PaymentPurpose;

    planName: string;
    description: string;

    metadata: Record<string, string>;
  }): Promise<string>;
}
