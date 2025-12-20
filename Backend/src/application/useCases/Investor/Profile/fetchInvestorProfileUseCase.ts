import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchInvestorProfileUseCase } from "@domain/interfaces/useCases/investor/profile/IFetchInvestorProfileUseCase";
import { INVESTOR_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { InvestorProfileDTO } from "application/dto/investor/investorProfileDTO";
import { InvestorMapper } from "application/mappers/investorMapper";

export class FetchInvestorProfileUseCase implements IFetchInvestorProfileUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async getProfileData(id: string): Promise<InvestorProfileDTO> {
    const investor = await this._investorRepository.findById(id);

    if (!investor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
    }

    const profileData: InvestorProfileDTO = InvestorMapper.investorProfileDatatoDTO(investor);
    profileData.profileImg = await this._storageService.createSignedUrl(
      profileData.profileImg!,
      10 * 60
    );
    console.log("Investor profileData  : ,", profileData);

    return profileData;
  }
}
