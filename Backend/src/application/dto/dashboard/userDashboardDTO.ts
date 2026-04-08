export interface ProjectPerformanceDTO {
  projectId: string;
  startupName: string;
  totalInvestment: number;
  investorsCount: number;
  latestReport: {
    revenue: number;
    netProfitLossAmount: number;
    month: string;
    year: number;
  } | null;
}

export interface UserDashboardResponseDTO {
  totalProjects: number;
  totalInvestment: number;
  totalInvestors: number;
  projects: ProjectPerformanceDTO[];
}
