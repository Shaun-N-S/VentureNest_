/**
 * Sentinel stored in a plan's `limits.*` fields to mean "no cap".
 * Mirrors the backend (`Backend/src/shared/constants/plan.ts`).
 */
export const UNLIMITED = -1;

/** True when a limit value imposes no cap (unlimited): -1, or absent. */
export const isUnlimited = (value: number | null | undefined): boolean =>
  value === undefined || value === null || value === UNLIMITED;

/** Human-readable limit for display. Never returns "-1". */
export const formatLimit = (value: number | null | undefined): string =>
  isUnlimited(value) ? "Unlimited" : String(value);
