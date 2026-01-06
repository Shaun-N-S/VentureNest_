import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReportReason } from "@domain/enum/reportReason";
import { ReporterType } from "@domain/enum/reporterRole";

export interface CreateReportDTO {
  reportedById: string;
  reportedByType: ReporterType;

  targetType: ReportTargetType;
  targetId: string;

  reasonCode: ReportReason;
  reasonText?: string;
}
