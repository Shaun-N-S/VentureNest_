import { AdminFinanceSummaryDTO } from "application/dto/admin/adminFinanceSummaryDTO";

export interface IGetAdminFinanceSummaryUseCase {
  execute(): Promise<AdminFinanceSummaryDTO>;
}
