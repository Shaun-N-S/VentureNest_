/**
 * Single source of truth for money display across the app.
 * Convention: Indian Rupee, `en-IN` locale.
 */

/** Full amount, e.g. ₹12,50,000 */
export const formatCurrency = (amount?: number | null): string =>
  `₹${Math.round(Number(amount) || 0).toLocaleString("en-IN")}`;

/**
 * Compact amount for dense cards, e.g. ₹40k · ₹1.2M · ₹1.5Cr.
 * Thresholds match the formatter previously used on the inbox page so
 * existing output is unchanged there.
 */
export const formatCompactCurrency = (amount?: number | null): string => {
  const n = Number(amount) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 1000000) return `₹${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${Math.round(n)}`;
};
