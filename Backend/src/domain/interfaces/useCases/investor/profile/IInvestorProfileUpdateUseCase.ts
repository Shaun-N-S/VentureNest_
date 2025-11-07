import {
  InvestorProfileUpdateDTO,
  InvestorProfileUpdateResDTO,
} from "application/dto/investor/investorProfileDTO";

export interface IInvestorProfileUpdateUseCase {
  updateInvestorProfile(
    data: InvestorProfileUpdateDTO
  ): Promise<InvestorProfileUpdateResDTO | null>;
}
