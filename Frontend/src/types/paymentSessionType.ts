export type PaymentPurpose = "SUBSCRIPTION" | "WALLET_TOPUP" | "DEAL_INSTALLMENT";

export interface PaymentSessionSummary {
  found: boolean;
  sessionId: string;
  purpose?: PaymentPurpose;
  amount?: number;
  createdAt?: string;
  dealId?: string;
  planId?: string;
  startupName?: string;
}
