import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IInvestorProfileUpdateUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorProfileUpdateUseCase";
import { INVESTOR_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import {
  InvestorProfileUpdateDTO,
  InvestorProfileUpdateResDTO,
} from "application/dto/investor/investorProfileDTO";
import { InvestorMapper } from "application/mappers/investorMapper";

export class InvestorProfileUpdateUseCase implements IInvestorProfileUpdateUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async updateInvestorProfile(
    data: InvestorProfileUpdateDTO
  ): Promise<InvestorProfileUpdateResDTO | null> {
    const { id, formData, profileImg } = data;
    console.log("data received in the useCase : : : : : :    :", id, formData, profileImg);

    const investor = await this._investorRepository.findById(id);

    if (!investor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
    }

    let profileImgKey = investor.profileImg || "";

    if (profileImg) {
      profileImgKey = await this._storageService.upload(
        profileImg,
        StorageFolderNames.PROFILE_IMAGE + "/" + id + Date.now()
      );
      console.log("if", profileImgKey);
    }
    console.log("out", profileImgKey);

    const updatedData = {
      ...formData,
      profileImg: profileImgKey ?? "",
      updatedAt: new Date(),
    };

    console.log("udpated data ???????? : : : ;   ", updatedData);

    const updatedInvestor = await this._investorRepository.update(id, updatedData);

    if (!updatedInvestor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
    }

    const response: InvestorProfileUpdateResDTO =
      InvestorMapper.investorProfileUpdateResDTO(updatedInvestor);
    response.profileImg = await this._storageService.createSignedUrl(profileImgKey, 10 * 60);

    return response;
  }
}
