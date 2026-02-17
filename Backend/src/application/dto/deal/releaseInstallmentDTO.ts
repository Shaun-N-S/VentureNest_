import { PaymentMethod } from "@domain/enum/paymentMethod";

export interface ReleaseDealInstallmentDTO {
  dealId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}
