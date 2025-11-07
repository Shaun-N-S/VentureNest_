import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { InvestorKYCUpdateDTO } from "application/dto/investor/investorKYCUpdateDTO";

export interface IInvestorKYCUpdateUseCase {
  updateKYC(data: InvestorKYCUpdateDTO): Promise<InvestorEntity | null>;
}
