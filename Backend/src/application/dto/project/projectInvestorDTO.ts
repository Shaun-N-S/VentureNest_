export interface ProjectInvestorDTO {
  investorId: string;
  name: string;
  companyName: string | null;
  avatar: string | null;
  investedAmount: number;
  equityPercentage: number;
  status: string;
  since: Date;
}

export interface GetProjectInvestorsRequestDTO {
  projectId: string;
  page: number;
  limit: number;
  /** Optional case-insensitive search on investor userName / companyName (DB-side). */
  search?: string | undefined;
  /** Authenticated viewer — used to enforce investor-insight access. */
  viewerId: string;
  viewerRole: string;
}

export interface GetProjectInvestorsResponseDTO {
  investors: ProjectInvestorDTO[];
  total: number;
  currentPage: number;
  totalPages: number;
}

/** Row shape returned by the deal↔investor aggregation. */
export interface ProjectInvestorDealRow {
  investorId: string;
  investedAmount: number;
  equityPercentage: number;
  status: string;
  since: Date;
  investorName: string | null;
  investorCompany: string | null;
  investorAvatar: string | null;
}
