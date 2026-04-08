export interface AdminDashboardSummary {
  totalUsers: number;
  totalInvestors: number;
  totalProjects: number;

  totalRevenue: number;
  subscriptionRevenue: number;
  commissionRevenue: number;

  totalDealsCompleted: number;
  totalDealsPartiallyPaid: number;
}

export interface MonthlyRevenue {
  month: string;
  amount: number;
}

export interface TopStartup {
  projectId: string;
  startupName: string;
  totalFunding: number;
  logoUrl?: string;
}

export interface TopInvestor {
  investorId: string;
  userName: string;
  totalInvested: number;
  profileImg?: string;
}

export interface AdminDashboardTop {
  topStartups: TopStartup[];
  topInvestors: TopInvestor[];
}
