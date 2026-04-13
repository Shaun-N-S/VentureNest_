import { AdminDashboardInsightsDTO } from "application/dto/admin/adminDashboardInsightsDTO";

export interface IGetAdminDashboardInsightsUseCase {
  execute(): Promise<AdminDashboardInsightsDTO>;
}
