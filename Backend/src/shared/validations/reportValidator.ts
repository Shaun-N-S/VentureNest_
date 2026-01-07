import z from "zod";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReportReason } from "@domain/enum/reportReason";

export const createReportSchema = z.object({
  reportedItemId: z.string().min(1, "Target ID is required"),

  reportedItemType: z.nativeEnum(ReportTargetType),

  reasonCode: z.nativeEnum(ReportReason),

  reasonText: z.string().trim().min(5, "Reason too short").optional(),
});
