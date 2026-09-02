import type { CurrentSubscription } from "../../types/currentSubscriptionType";

/**
 * FULL    – admin or the project owner: every field, incl. invested amount + deal status.
 * PARTIAL – authenticated USER/INVESTOR with an active subscription: identity, company,
 *           equity % and since date. NO invested amount, NO deal status.
 * LOCKED  – authenticated USER/INVESTOR without an active subscription: only aggregate
 *           counts + a premium upsell. No individual investor data.
 */
export type InvestorAccessTier = "FULL" | "PARTIAL" | "LOCKED";

export const hasActiveSubscription = (
  sub: CurrentSubscription | null | undefined,
): boolean =>
  Boolean(
    sub && sub.status === "ACTIVE" && new Date(sub.expiresAt) > new Date(),
  );

export const getInvestorAccessTier = (params: {
  role: string | null | undefined;
  isOwner: boolean;
  subscription: CurrentSubscription | null | undefined;
}): InvestorAccessTier => {
  const { role, isOwner, subscription } = params;

  if (role === "ADMIN" || isOwner) return "FULL";
  if (hasActiveSubscription(subscription)) return "PARTIAL";
  return "LOCKED";
};
