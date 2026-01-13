import { Document, model, Types } from "mongoose";
import projectMonthlyReportSchema from "../schema/projectMonthlyReportSchema";
import { ProjectReportMonth } from "@domain/enum/reportMonth";
import { NetProfitLossType } from "@domain/enum/NetProfitLossType";

export interface IProjectMonthlyReportModel extends Document {
  projectId: Types.ObjectId;
  month: ProjectReportMonth;
  year: number;

  revenue: number;
  expenditure: number;

  netProfitLossType: NetProfitLossType;
  netProfitLossAmount: number;

  keyAchievement: string;
  challenges: string;

  isConfirmed: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const projectMonthlyReportModel = model<IProjectMonthlyReportModel>(
  "ProjectMonthlyReport",
  projectMonthlyReportSchema
);
