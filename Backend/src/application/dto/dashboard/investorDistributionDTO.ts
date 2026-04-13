export interface DistributionItemDTO {
  name: string;
  value: number;
}

export interface InvestorDistributionDTO {
  investmentDistribution: DistributionItemDTO[];
  stageDistribution: DistributionItemDTO[];
}
