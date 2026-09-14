import { CONFIG } from "@config/config";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IInvestorProfileUpdateUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorProfileUpdateUseCase";
import { INVESTOR_ERRORS } from "@shared/constants/error";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";
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

    const investor = await this._investorRepository.findById(id);

    if (!investor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
    }

    const effectiveMin = formData.investmentMin ?? investor.investmentMin;
    const effectiveMax = formData.investmentMax ?? investor.investmentMax;

    if (
      (formData.investmentMin !== undefined && formData.investmentMin <= 0) ||
      (formData.investmentMax !== undefined && formData.investmentMax <= 0)
    ) {
      throw new InvalidDataException(INVESTOR_ERRORS.INVALID_INVESTMENT_AMOUNT);
    }

    if (effectiveMin !== undefined && effectiveMax !== undefined && effectiveMax < effectiveMin) {
      throw new InvalidDataException(INVESTOR_ERRORS.INVALID_INVESTMENT_RANGE);
    }

    let profileImgKey = investor.profileImg || "";

    if (profileImg) {
      profileImgKey = await this._storageService.upload(
        profileImg,
        StorageFolderNames.PROFILE_IMAGE + "/" + id + Date.now()
      );
    }

    const updatedData = {
      ...formData,
      profileImg: profileImgKey ?? "",
      updatedAt: new Date(),
    };

    const updatedInvestor = await this._investorRepository.update(id, updatedData);

    if (!updatedInvestor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
    }

    const response: InvestorProfileUpdateResDTO =
      InvestorMapper.investorProfileUpdateResDTO(updatedInvestor);
    response.profileImg = await this._storageService.createSignedUrl(
      profileImgKey,
      CONFIG.SIGNED_URL_EXPIRY
    );

    return response;
  }
}
