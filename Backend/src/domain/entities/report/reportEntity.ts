import { ReportStatus } from "@domain/enum/reportStatus";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReportReason } from "@domain/enum/reportReason";
import { ReporterType } from "@domain/enum/reporterRole";

export interface ReportEntity {
  _id?: string;

  reportedById: string;
  reportedByType: ReporterType;

  targetType: ReportTargetType;
  targetId: string;

  reasonCode: ReportReason;
  reasonText?: string;

  status: ReportStatus;
  reviewedBy?: string;
  actionTaken?: string;
  reviewedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
