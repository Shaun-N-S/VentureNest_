import { z } from "zod";
import { ReportStatus } from "@domain/enum/reportStatus";

export const updateReportStatusSchema = z
  .object({
    status: z.nativeEnum(ReportStatus),
    actionTaken: z.string().min(3).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === ReportStatus.ACTION_TAKEN && !data.actionTaken) {
      ctx.addIssue({
        path: ["actionTaken"],
        message: "actionTaken is required when status is ACTION_TAKEN",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
