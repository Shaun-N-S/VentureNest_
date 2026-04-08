import { AdminDashboardTopDTO } from "application/dto/admin/adminDashboardTopDTO";

export interface IGetAdminDashboardTopUseCase {
  execute(): Promise<AdminDashboardTopDTO>;
}
