import { z } from "zod";

export const investmentOfferSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  equityPercentage: z.coerce
    .number()
    .min(0.1, "Equity must be at least 0.1%")
    .max(100, "Equity cannot exceed 100%"),
  valuation: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().positive("Valuation must be positive").optional(),
  ),
  terms: z.string().min(20, "Terms should be at least 20 characters"),
  note: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type InvestmentOfferInput = z.input<typeof investmentOfferSchema>;
export type InvestmentOfferOutput = z.output<typeof investmentOfferSchema>;
