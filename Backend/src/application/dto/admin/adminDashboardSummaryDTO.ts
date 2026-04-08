export interface AdminDashboardSummaryDTO {
  totalUsers: number;
  totalInvestors: number;
  totalProjects: number;

  totalRevenue: number;
  subscriptionRevenue: number;
  commissionRevenue: number;

  totalDealsCompleted: number;
  totalDealsPartiallyPaid: number;
}
