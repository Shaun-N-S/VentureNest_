export interface MonthlyReport {
  month: string;
  year: number;
  revenue: number;
  expenditure: number;
  netProfitLossAmount: number;
  keyAchievements: string;
  challenges: string;
  netProfitLossType: "profit" | "loss";
}
