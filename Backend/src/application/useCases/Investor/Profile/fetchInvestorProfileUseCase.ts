import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchInvestorProfileUseCase } from "@domain/interfaces/useCases/investor/profile/IFetchInvestorProfileUseCase";
import { INVESTOR_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { InvestorProfileDTO } from "application/dto/investor/investorProfileDTO";
import { InvestorMapper } from "application/mappers/investorMapper";

export class FetchInvestorProfileUseCase implements IFetchInvestorProfileUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _relationshipRepo: IRelationshipRepository,
    private _postRepo: IPostRepository,
    private _storageService: IStorageService
  ) {}

  async getProfileData(id: string): Promise<InvestorProfileDTO> {
    const investor = await this._investorRepository.findById(id);

    if (!investor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
    }

    const profileData = InvestorMapper.investorProfileDatatoDTO(investor);

    if (profileData.profileImg) {
      profileData.profileImg = await this._storageService.createSignedUrl(
        profileData.profileImg,
        10 * 60
      );
    }

    profileData.connectionsCount = await this._relationshipRepo.countConnections(id);

    profileData.postCount = await this._postRepo.countPostsByAuthor(id);

    return profileData;
  }
}
