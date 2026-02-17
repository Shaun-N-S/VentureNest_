import { UserRole } from "@domain/enum/userRole";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export interface PaymentEntity {
  id?: string;
  sessionId: string;
  dealId?: string;
  ownerId: string;
  ownerRole: UserRole;

  planId?: string;
  amount: number;

  purpose: PaymentPurpose;

  createdAt?: Date;
}
