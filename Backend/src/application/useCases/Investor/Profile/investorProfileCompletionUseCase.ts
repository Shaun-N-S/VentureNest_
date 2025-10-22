import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IInvestorProfileCompletionUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorProfileCompletionUseCase";
import { Errors, INVESTOR_ERRORS } from "@shared/constants/error";
import { InvestorProfileSchema } from "@shared/validations/investorProfileCompletionValidator";
import { InvalidDataException } from "application/constants/exceptions";

export class InvestorProfileCompletionUseCase implements IInvestorProfileCompletionUseCase {
  constructor(private investorRepository: IInvestorRepository) {}

  async profileCompletion(
    investorId: string,
    profileData: Partial<InvestorEntity>
  ): Promise<InvestorEntity> {
    const investor = await this.investorRepository.findById(investorId);
    if (!investor) {
      throw new Error(INVESTOR_ERRORS.INVESTOR_NOT_FOUND);
    }

    // const verifiedProfileData = InvestorProfileSchema.safeParse(profileData);

    // if (verifiedProfileData.error) {
    //   throw new InvalidDataException(Errors.INVALID_DATA);
    // }

    const updatedInvestor = await this.investorRepository.updateById(investorId, {
      ...profileData,
      isFirstLogin: false,
    });

    console.log("updated investor :  :  :  ", updatedInvestor);
    if (!updatedInvestor) {
      throw new Error(INVESTOR_ERRORS.PROFILE_UPDATION_FAILED);
    }

    return updatedInvestor;
  }
}
