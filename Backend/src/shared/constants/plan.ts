/**
 * Sentinel stored in a plan's `limits.*` fields to mean "no cap".
 * Kept as -1 (never migrated). An absent/`undefined` limit is also treated as unlimited.
 */
export const UNLIMITED = -1;

/** True when a limit value imposes no cap (unlimited): -1, or absent. */
export const isUnlimited = (value: number | null | undefined): boolean =>
  value === undefined || value === null || value === UNLIMITED;

/** Allowed limit values: the UNLIMITED sentinel, or a non-negative integer. */
export const isValidLimit = (value: number): boolean =>
  Number.isInteger(value) && value >= UNLIMITED;

/** Human-readable limit for display. Never returns "-1". */
export const formatLimit = (value: number | null | undefined): string =>
  isUnlimited(value) ? "Unlimited" : String(value);
