import mongoose from "mongoose";
import { ReportStatus } from "@domain/enum/reportStatus";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReportReason } from "@domain/enum/reportReason";
import { ReporterType } from "@domain/enum/reporterRole";

const reportSchema = new mongoose.Schema(
  {
    reportedById: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    reportedByType: {
      type: String,
      enum: Object.values(ReporterType),
      required: true,
    },

    targetType: {
      type: String,
      enum: Object.values(ReportTargetType),
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    reasonCode: {
      type: String,
      enum: Object.values(ReportReason),
      required: true,
    },

    reasonText: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
      index: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    actionTaken: {
      type: String,
    },

    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate reports
 * Same reporter reporting same target again
 */
reportSchema.index(
  { reportedById: 1, reportedByType: 1, targetType: 1, targetId: 1 },
  { unique: true }
);

/**
 * Admin dashboard & analytics
 */
reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

export default reportSchema;
