import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUpdateInvestorStatusUseCase } from "@domain/interfaces/useCases/admin/investor/IUpdateInvestorStatusUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { InvestorDTO } from "application/dto/investor/investorDTO";

export class UpdateInvestorStatusUseCase implements IUpdateInvestorStatusUseCase {
  constructor(private _investorRepository: IInvestorRepository) {}

  async updateInvestorStatus(
    investorId: string,
    currentStatus: UserStatus
  ): Promise<{ investor: InvestorDTO }> {
    const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;

    const updatedInvestor = await this._investorRepository.updateStatus(investorId, newStatus);

    if (!updatedInvestor) throw new Error(USER_ERRORS.USER_NOT_FOUND);

    return { investor: updatedInvestor as InvestorDTO };
  }
}
