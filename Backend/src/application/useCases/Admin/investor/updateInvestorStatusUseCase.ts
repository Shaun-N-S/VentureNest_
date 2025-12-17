import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IUpdateInvestorStatusUseCase } from "@domain/interfaces/useCases/admin/investor/IUpdateInvestorStatusUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { InvestorDTO } from "application/dto/investor/investorDTO";

export class UpdateInvestorStatusUseCase implements IUpdateInvestorStatusUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _cacheService: IKeyValueTTLCaching
  ) {}

  async updateInvestorStatus(
    investorId: string,
    currentStatus: UserStatus
  ): Promise<{ investor: InvestorDTO }> {
    const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;

    const updatedInvestor = await this._investorRepository.updateStatus(investorId, newStatus);

    if (!updatedInvestor) throw new Error(USER_ERRORS.USER_NOT_FOUND);

    await this._cacheService.deleteData(`USER_STATUS:${UserRole.INVESTOR}:${investorId}`);

    return { investor: updatedInvestor as InvestorDTO };
  }
}
