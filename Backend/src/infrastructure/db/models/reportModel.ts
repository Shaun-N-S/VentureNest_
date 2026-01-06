import { Document, model } from "mongoose";
import reportSchema from "../schema/reportSchema";
import { ReportStatus } from "@domain/enum/reportStatus";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReportReason } from "@domain/enum/reportReason";
import { ReporterType } from "@domain/enum/reporterRole";

export interface IReportModel extends Document {
  _id: string;

  reportedById: string;
  reportedByType: ReporterType;

  targetType: ReportTargetType;
  targetId: string;

  reasonCode: ReportReason;
  reasonText?: string;

  status: ReportStatus;

  reviewedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const reportModel = model<IReportModel>("Report", reportSchema);
