export interface CreateInvestmentOfferDTO {
  pitchId: string;
  projectId: string;

  amount: number;
  equityPercentage: number;
  terms: string;

  valuation?: number | undefined;
  note?: string | undefined;
  expiresAt?: Date | undefined;
}
