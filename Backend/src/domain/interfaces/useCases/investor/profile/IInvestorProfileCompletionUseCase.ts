import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { InvestorProfileCompletionReqDTO } from "application/dto/investor/investorProfileCompletionDTO";

export interface IInvestorProfileCompletionUseCase {
  profileCompletion(data: InvestorProfileCompletionReqDTO): Promise<InvestorEntity>;
}
