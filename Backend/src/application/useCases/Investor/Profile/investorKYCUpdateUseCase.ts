import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IInvestorKYCUpdateUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorKYCUpdateUseCase";
import { INVESTOR_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { InvestorKYCUpdateDTO } from "application/dto/investor/investorKYCUpdateDTO";

export class InvestorKYCUpdateUseCase implements IInvestorKYCUpdateUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

  async updateKYC(data: InvestorKYCUpdateDTO): Promise<InvestorEntity | null> {
    const { id, formData, aadharImg, selfieImg } = data;

    const investor = await this._investorRepository.findById(id);

    if (!investor) {
      throw new NotFoundExecption(INVESTOR_ERRORS.INVESTOR_NOT_FOUND);
    }

    // let aadharImgKey =
    return null;
  }
}
