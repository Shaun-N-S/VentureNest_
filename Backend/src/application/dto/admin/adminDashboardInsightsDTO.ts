export interface PieChartDataDTO {
  name: string;
  value: number;
}

export interface AdminDashboardInsightsDTO {
  categoryDistribution: PieChartDataDTO[];
  stageDistribution: PieChartDataDTO[];
}
