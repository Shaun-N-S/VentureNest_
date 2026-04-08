import { DealEntity } from "@domain/entities/deal/dealEntity";
import { IBaseRepository } from "./IBaseRepository";
import { ClientSession } from "mongoose";
import { InvestorPortfolioData } from "application/dto/dashboard/investorPortfolioDTO";

export interface IDealRepository extends IBaseRepository<DealEntity> {
  findByOfferId(offerId: string): Promise<DealEntity | null>;
  incrementPaidAmount(dealId: string, amount: number, session?: ClientSession): Promise<void>;
  findByInvestorId(investorId: string): Promise<DealEntity[]>;
  findByFounderId(founderId: string): Promise<DealEntity[]>;
  countByStatus(status: string): Promise<number>;
  findByProjectId(projectId: string): Promise<DealEntity[]>;
  findInvestorPortfolio(investorId: string): Promise<InvestorPortfolioData>;
  getTopStartups(limit: number): Promise<{ projectId: string; totalFunding: number }[]>;
  getTopInvestors(limit: number): Promise<{ investorId: string; totalInvested: number }[]>;
}
