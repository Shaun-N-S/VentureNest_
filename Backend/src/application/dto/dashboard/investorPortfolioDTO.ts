export interface InvestorPortfolioItemDTO {
  projectId: string;
  startupName: string;
  investedAmount: number;
  equity: number;
  stage: string;
  status: string;
}

export type InvestorPortfolioDTO = InvestorPortfolioItemDTO[];
