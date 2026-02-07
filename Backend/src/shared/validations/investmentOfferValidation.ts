import { z } from "zod";

export const createInvestmentOfferSchema = z.object({
  pitchId: z.string().min(1),
  projectId: z.string().min(1),

  amount: z.number().positive(),
  equityPercentage: z.number().positive().max(100),
  terms: z.string().min(1),

  valuation: z.number().positive().optional(),
  note: z.string().optional(),
  expiresAt: z.coerce.date().optional(),
});
