import mongoose from "mongoose";
import { ProjectReportMonth } from "@domain/enum/reportMonth";
import { NetProfitLossType } from "@domain/enum/NetProfitLossType";

const projectMonthlyReportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    month: {
      type: String,
      enum: Object.values(ProjectReportMonth),
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    revenue: {
      type: Number,
      required: true,
      min: 0,
    },

    expenditure: {
      type: Number,
      required: true,
      min: 0,
    },

    netProfitLossType: {
      type: String,
      enum: Object.values(NetProfitLossType),
      required: true,
    },

    netProfitLossAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    keyAchievement: {
      type: String,
      required: true,
      trim: true,
    },

    challenges: {
      type: String,
      required: true,
      trim: true,
    },

    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default projectMonthlyReportSchema;
