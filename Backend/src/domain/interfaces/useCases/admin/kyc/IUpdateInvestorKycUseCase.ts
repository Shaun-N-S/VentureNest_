import { KYCStatus } from "@domain/enum/kycStatus";
import { KycDTO } from "application/dto/admin/kycDTO";

export interface IUpdateInvestorKycStatusUseCase {
  updateInvestorKycStatus(investorId: string, newStatus: KYCStatus): Promise<{ investor: KycDTO }>;
}
