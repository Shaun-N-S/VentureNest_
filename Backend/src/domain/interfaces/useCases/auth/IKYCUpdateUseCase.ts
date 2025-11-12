import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { InvestorKYCUpdateDTO } from "application/dto/investor/investorKYCUpdateDTO";

export interface IKYCUpdateUseCase {
  updateKYC(data: InvestorKYCUpdateDTO): Promise<InvestorEntity | null>;
}
