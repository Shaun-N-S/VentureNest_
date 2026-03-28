export interface GetProjectReportAnalyticsRequestDTO {
  projectId: string;
  fromDate?: string; // ISO
  toDate?: string; // ISO
  month?: string;
  year?: number;
}

export interface MonthlyReportPointDTO {
  month: string;
  year: number;
  revenue: number;
  expenditure: number;
  netProfitLossAmount: number;
}

export interface ProjectReportAnalyticsResponseDTO {
  projectId: string;
  reports: MonthlyReportPointDTO[];
}
