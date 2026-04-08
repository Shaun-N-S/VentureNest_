export interface InvestmentChartItemDTO {
  month: string;
  year: number;
  totalInvested: number;
}

export type InvestmentChartDTO = InvestmentChartItemDTO[];

export interface InvestmentChartData {
  year: number;
  month: number; // 1-12
  totalInvested: number;
}
