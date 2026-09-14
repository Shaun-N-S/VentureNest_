import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export interface PaymentSessionSummaryDTO {
  found: boolean;
  sessionId: string;
  purpose?: PaymentPurpose | undefined;
  amount?: number | undefined;
  createdAt?: Date | undefined;
  dealId?: string | undefined;
  planId?: string | undefined;
  startupName?: string | undefined;
}

export interface IGetPaymentSessionSummaryUseCase {
  execute(sessionId: string): Promise<PaymentSessionSummaryDTO>;
}
