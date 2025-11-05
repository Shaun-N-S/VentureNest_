import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { IBaseRepository } from "./IBaseRepository";
import { UserStatus } from "@domain/enum/userStatus";

export interface IInvestorRepository extends IBaseRepository<InvestorEntity> {
  findByEmail(email: string): Promise<InvestorEntity | null>;
  findByIdAndUpdatePassword(email: string, password: string): Promise<void>;
  updateStatus(investorId: string, status: UserStatus): Promise<InvestorEntity | null>;
  profileCompletion(id: string, data: Partial<InvestorEntity>): Promise<InvestorEntity | null>;
  googleSignUp(user: InvestorEntity): Promise<string>;
  setInterestedTopics(investorId: string, interestedTopics: string[]): Promise<void>;
}
