import { KYCStatus } from "@domain/enum/kycStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUpdateInvestorKycStatusUseCase } from "@domain/interfaces/useCases/admin/kyc/IUpdateInvestorKycUseCase";
import { INVESTOR_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { KycDTO } from "application/dto/admin/kycDTO";
import { KycMapper } from "application/mappers/kycMapper";

export class UpdateInvestorKycStatusUseCase implements IUpdateInvestorKycStatusUseCase {
  constructor(private _investorRepository: IInvestorRepository) {}

  async updateInvestorKycStatus(
    investorId: string,
    newStatus: KYCStatus
  ): Promise<{ investor: KycDTO }> {
    const updatedInvestor = await this._investorRepository.updateKycStatus(investorId, newStatus);

    if (!updatedInvestor) throw new NotFoundExecption(INVESTOR_ERRORS.NO_INVESTORS_FOUND);

    return { investor: KycMapper.investorKycRes(updatedInvestor) };
  }
}
