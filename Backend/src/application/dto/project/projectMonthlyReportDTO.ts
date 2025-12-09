import { ReportMonth } from "@domain/enum/reportMonth";
import { NetProfitLossType } from "@domain/enum/NetProfitLossType";

export interface ProjectMonthlyReportResDTO {
  _id: string;
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

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectMonthlyReportDTO {
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
}

export interface CreateProjectMonthlyReportEntityDTO {
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
}
