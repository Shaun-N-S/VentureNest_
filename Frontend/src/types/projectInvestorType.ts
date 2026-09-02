export interface ProjectInvestor {
  investorId: string;
  name: string;
  companyName: string | null;
  avatar: string | null;
  investedAmount: number;
  equityPercentage: number;
  status: string;
  since: string;
}

export interface ProjectInvestorsResponse {
  investors: ProjectInvestor[];
  total: number;
  currentPage: number;
  totalPages: number;
}
