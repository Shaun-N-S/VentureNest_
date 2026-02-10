import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export interface PaymentDTO {
  id: string;
  planId?: string;
  purpose: PaymentPurpose;
  amount: number;
  createdAt: Date;
}
