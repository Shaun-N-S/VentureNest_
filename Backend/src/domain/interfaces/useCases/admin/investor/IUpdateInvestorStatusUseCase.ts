import { UserStatus } from "@domain/enum/userStatus";
import { InvestorDTO } from "application/dto/investor/investorDTO";

export interface IUpdateInvestorStatusUseCase {
  updateInvestorStatus(
    investorId: string,
    currentStatus: UserStatus
  ): Promise<{ investor: InvestorDTO }>;
}
