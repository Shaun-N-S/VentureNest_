import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IInvestorProfileCompletionUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorProfileCompletionUseCase";
import { INVESTOR_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { InvestorProfileCompletionReqDTO } from "application/dto/investor/investorProfileCompletionDTO";

export class InvestorProfileCompletionUseCase implements IInvestorProfileCompletionUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async profileCompletion(data: InvestorProfileCompletionReqDTO): Promise<InvestorEntity> {
    const { id, formData, profileImg, portfolioPdf } = data;

    const investor = await this._investorRepository.findById(id);

    if (!investor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
    }

    let profileImgKey = investor.profileImg;
    let portfolioPdfKey = investor.portfolioPdf;

    if (profileImg) {
      profileImgKey = await this._storageService.upload(
        profileImg,
        StorageFolderNames.PROFILE_IMAGE + "/" + id + Date.now()
      );
    }

    if (portfolioPdf) {
      portfolioPdfKey = await this._storageService.upload(
        portfolioPdf,
        StorageFolderNames.PORTFOLIO_PDF + "/" + id + Date.now()
      );
    }

    const updatedData = {
      ...formData,
      profileImg: profileImgKey ?? "",
      portfolioPdf: portfolioPdfKey ?? "",
      isFirstLogin: false,
    };

    const updatedInvestor = await this._investorRepository.profileCompletion(id, updatedData);
    console.log("updatedInvestor data : return : : :  :", updatedInvestor);
    return updatedInvestor!;
  }
}
