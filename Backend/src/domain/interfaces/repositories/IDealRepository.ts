import { DealEntity } from "@domain/entities/deal/dealEntity";
import { IBaseRepository } from "./IBaseRepository";
import { ClientSession } from "mongoose";
import { InvestorPortfolioItemDTO } from "application/dto/dashboard/investorPortfolioDTO";
import { InvestmentChartData } from "application/dto/dashboard/investmentChartDTO";

export interface IDealRepository extends IBaseRepository<DealEntity> {
  findByOfferId(offerId: string): Promise<DealEntity | null>;
  incrementPaidAmount(dealId: string, amount: number, session?: ClientSession): Promise<void>;
  findByInvestorId(investorId: string): Promise<DealEntity[]>;
  findByFounderId(founderId: string): Promise<DealEntity[]>;
  countByStatus(status: string): Promise<number>;
  findByProjectId(projectId: string): Promise<DealEntity[]>;
  findInvestorPortfolio(investorId: string): Promise<InvestorPortfolioItemDTO[]>;
  findInvestmentChart(investorId: string): Promise<InvestmentChartData[]>;
}
