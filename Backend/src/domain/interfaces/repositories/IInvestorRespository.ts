import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IInvestorRepository extends IBaseRepository<InvestorEntity> {
  findByEmail(email: string): Promise<InvestorEntity | null>;
}
