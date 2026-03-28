export interface ProjectPerformance {
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

export interface UserDashboard {
  totalProjects: number;
  totalInvestment: number;
  totalInvestors: number;
  projects: ProjectPerformance[];
}

export interface ProjectReportPoint {
  month: string;
  year: number;
  revenue: number;
  expenditure: number;
  netProfitLossAmount: number;
}

export interface ProjectReportAnalyticsResponse {
  projectId: string;
  reports: ProjectReportPoint[];
}

export interface ProjectAnalyticsFilters {
  fromDate?: string;
  toDate?: string;
  month?: string;
  year?: number;
}

export interface InvestorDashboardSummary {
  totalInvested: number;
  activeInvestments: number;
  walletBalance: number;
  lockedBalance: number;
}

export interface InvestorPortfolioItem {
  projectId: string;
  startupName: string;
  investedAmount: number;
  equity: number;
  stage: string;
  status: string;
}

export type InvestorPortfolio = InvestorPortfolioItem[];
