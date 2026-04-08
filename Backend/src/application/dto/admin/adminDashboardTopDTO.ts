export interface TopStartupDTO {
  projectId: string;
  startupName: string;
  totalFunding: number;
  logoUrl?: string;
}

export interface TopInvestorDTO {
  investorId: string;
  userName: string;
  totalInvested: number;
  profileImg?: string;
}

export interface AdminDashboardTopDTO {
  topStartups: TopStartupDTO[];
  topInvestors: TopInvestorDTO[];
}
