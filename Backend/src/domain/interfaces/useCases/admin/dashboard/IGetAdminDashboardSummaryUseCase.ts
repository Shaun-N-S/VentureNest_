import { AdminDashboardSummaryDTO } from "application/dto/admin/adminDashboardSummaryDTO";

export interface IGetAdminDashboardSummaryUseCase {
  execute(): Promise<AdminDashboardSummaryDTO>;
}
