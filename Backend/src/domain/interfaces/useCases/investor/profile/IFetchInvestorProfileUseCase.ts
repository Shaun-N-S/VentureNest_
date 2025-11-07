import { InvestorProfileDTO } from "application/dto/investor/investorProfileDTO";

export interface IFetchInvestorProfileUseCase {
  getProfileData(id: string): Promise<InvestorProfileDTO>;
}
