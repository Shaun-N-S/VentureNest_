export interface InvestorPortfolioItemDTO {
  projectId: string;
  startupName: string;
  investedAmount: number;
  equity: number;
  logo?: string;
  stage: string;
  status: string;
}

export type InvestorPortfolioData = InvestorPortfolioItemDTO[];
