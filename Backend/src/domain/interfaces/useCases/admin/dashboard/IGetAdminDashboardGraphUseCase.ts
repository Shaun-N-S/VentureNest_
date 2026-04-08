import { MonthlyRevenueDTO } from "application/dto/admin/monthlyRevenueDTO";

export interface GetGraphParams {
  type: "subscription" | "commission";
  year?: number;
  month?: number;
  fromDate?: Date;
  toDate?: Date;
}

export interface IGetAdminDashboardGraphUseCase {
  execute(params: GetGraphParams): Promise<MonthlyRevenueDTO[]>;
}
