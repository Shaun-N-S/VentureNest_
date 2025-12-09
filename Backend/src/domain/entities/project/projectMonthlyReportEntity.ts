import { NetProfitLossType } from "@domain/enum/NetProfitLossType";
import { ReportMonth } from "@domain/enum/reportMonth";

export interface ProjectMonthlyReportEntity {
  _id?: string;
  projectId: string;
  month: ReportMonth;
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
