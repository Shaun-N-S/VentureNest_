import { z } from "zod";
import { ReportMonth } from "@domain/enum/reportMonth";
import { NetProfitLossType } from "@domain/enum/NetProfitLossType";

export const CreateMonthlyReportReqSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),

  month: z.enum(Object.values(ReportMonth)),
  year: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z
      .number()
      .min(2000, "Year must be greater than 2000")
      .max(new Date().getFullYear(), "Year cannot be in the future")
  ),

  revenue: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0, "Revenue cannot be negative")
  ),

  expenditure: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0, "Expenditure cannot be negative")
  ),

  netProfitLossAmount: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0, "Amount cannot be negative")
  ),

  netProfitLossType: z
    .nativeEnum(NetProfitLossType)
    .refine((val) => Object.values(NetProfitLossType).includes(val), {
      message: "Invalid type (profit or loss required)",
    }),

  keyAchievement: z
    .string()
    .min(1, "Achievements are required")
    .max(500, "Achievement text too long"),

  challenges: z.string().min(1, "Challenges are required").max(500, "Challenge text too long"),

  isConfirmed: z.boolean(),
});
