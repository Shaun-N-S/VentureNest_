import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { CapTableEntity } from "@domain/entities/investor/capTableEntity";
import { ProjectMonthlyReportEntity } from "@domain/entities/project/projectMonthlyReportEntity";
import { ProjectPerformanceDTO } from "application/dto/dashboard/userDashboardDTO";

export class DashboardMapper {
  static toProjectPerformanceDTO(
    project: ProjectEntity,
    deals: DealEntity[],
    capTable: CapTableEntity | null,
    latestReport: ProjectMonthlyReportEntity | null
  ): ProjectPerformanceDTO {
    const totalInvestment = deals.reduce((sum: number, d: DealEntity) => sum + d.totalAmount, 0);

    const investorsCount = capTable?.shareholders.length || 0;

    return {
      projectId: project._id!,
      startupName: project.startupName,
      totalInvestment,
      investorsCount,
      latestReport: latestReport
        ? {
            revenue: latestReport.revenue,
            netProfitLossAmount: latestReport.netProfitLossAmount,
            month: latestReport.month,
            year: latestReport.year,
          }
        : null,
    };
  }
}
