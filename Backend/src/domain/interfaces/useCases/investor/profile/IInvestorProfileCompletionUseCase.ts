import { InvestorEntity } from "@domain/entities/investor/investorEntity";

export interface IInvestorProfileCompletionUseCase {
  profileCompletion(
    investorId: string,
    profileData: Partial<InvestorEntity>
  ): Promise<InvestorEntity>;
}
