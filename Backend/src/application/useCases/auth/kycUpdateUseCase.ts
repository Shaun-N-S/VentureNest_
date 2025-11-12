import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { KYCStatus } from "@domain/enum/kycStatus";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IKYCUpdateUseCase } from "@domain/interfaces/useCases/auth/IKYCUpdateUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { InvestorKYCUpdateDTO } from "application/dto/investor/investorKYCUpdateDTO";

export class KYCUpdateUseCase implements IKYCUpdateUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _userRepository: IUserRepository,
    private _storageService: IStorageService
  ) {}

  async updateKYC(data: InvestorKYCUpdateDTO): Promise<InvestorEntity | null> {
    const { id, formData, aadharImg, selfieImg } = data;

    const existingInvestor = this._investorRepository.findById(id);
    const existingUser = this._userRepository.findById(id);

    const [user, investor] = await Promise.all([existingUser, existingInvestor]);

    if (!investor && !user) {
      throw new NotFoundExecption(USER_ERRORS.USER_NOT_FOUND);
    }

    let aadharImgKey;
    let selfieImgKey;

    if (aadharImg) {
      aadharImgKey = await this._storageService.upload(
        aadharImg,
        StorageFolderNames.AADHAR_IMAGE + "/" + "id" + Date.now()
      );
    }

    if (selfieImg) {
      selfieImgKey = await this._storageService.upload(
        selfieImg,
        StorageFolderNames.SELFIE_IMAGE + "/" + "id" + Date.now()
      );
    }

    const updateData = {
      ...formData,
      aadharImg: aadharImgKey ?? "",
      selfieImg: selfieImgKey ?? "",
      kycStatus: KYCStatus.SUBMITTED,
    };

    if (investor) {
      await this._investorRepository.update(id, updateData);
    }

    if (user) {
      await this._userRepository.update(id, updateData);
    }

    return null;
  }
}
