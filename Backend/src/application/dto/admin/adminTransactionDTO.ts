export interface GetAdminTransactionsRequestDTO {
  reason?: string;
  action?: string;
  status?: string;
  dealId?: string;
  page: number;
  limit: number;
}

export type AdminTransactionRelatedEntityType = "PROJECT" | "USER" | "INVESTOR" | "SYSTEM";

export interface AdminTransactionDTO {
  id: string;
  fromWalletId?: string;
  toWalletId?: string;
  relatedDealId?: string;
  amount: number;
  action: string;
  reason: string;
  status: string;
  createdAt: Date;

  /**
   * Human-readable name of the party/entity a transaction relates to, resolved
   * purely via aggregation lookups on existing collections. `null` when it
   * cannot be resolved (e.g. historical SUBSCRIPTION rows) — callers render "System".
   */
  displayName: string | null;

  /** Related project name when one is involved (deal-based or project-wallet based); otherwise `null`. */
  relatedProjectName: string | null;

  relatedEntityType: AdminTransactionRelatedEntityType;
}
