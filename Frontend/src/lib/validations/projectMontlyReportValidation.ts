import { z } from "zod";

export const monthlyReportSchema = z.object({
  month: z.string().min(1, "Please select a month"),
  revenue: z
    .string()
    .min(1, "Revenue is required")
    .refine((val) => !isNaN(Number.parseFloat(val)), "Must be a valid number"),
  expenditure: z
    .string()
    .min(1, "Expenditure is required")
    .refine((val) => !isNaN(Number.parseFloat(val)), "Must be a valid number"),
  profitLossAmount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number.parseFloat(val)), "Must be a valid number"),
  profitLossType: z.enum(["profit", "loss"], "Select profit or loss"),
  achievements: z
    .string()
    .min(10, "Achievements must be at least 10 characters")
    .max(1000, "Max 1000 characters"),
  challenges: z
    .string()
    .min(10, "Challenges must be at least 10 characters")
    .max(1000, "Max 1000 characters"),
  confirmation: z
    .boolean()
    .refine((val) => val, "You must confirm the information is accurate"),
});

export type MonthlyReportFormData = z.infer<typeof monthlyReportSchema>;
