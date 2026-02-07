import { z } from "zod";

export const investmentOfferSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),

  equityPercentage: z
    .number()
    .min(0.1, "Equity must be at least 0.1%")
    .max(100, "Equity cannot exceed 100%"),

  valuation: z.number().positive("Valuation must be positive").optional(),

  terms: z.string().min(20, "Terms should be at least 20 characters"),

  note: z.string().optional(),

  expiresAt: z.string().optional(),
});

export type InvestmentOfferFormValues = z.infer<typeof investmentOfferSchema>;
