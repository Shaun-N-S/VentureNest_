import { KYCStatus } from "@domain/enum/kycStatus";
import { KycDTO } from "application/dto/admin/kycDTO";

export interface IUpdateUserKycStatusUseCase {
  updateUserKycStatus(
    userId: string,
    newStatus: KYCStatus,
    reason?: string
  ): Promise<{ user: KycDTO }>;
}
