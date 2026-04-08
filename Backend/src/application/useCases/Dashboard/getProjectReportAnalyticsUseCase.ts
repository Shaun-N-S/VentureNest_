import { IGetProjectReportAnalyticsUseCase } from "@domain/interfaces/useCases/dashboard/IGetProjectReportAnalyticsUseCase";
import { IProjectMonthlyReportRepository } from "@domain/interfaces/repositories/IProjectMonthlyReportRepository";
import {
  GetProjectReportAnalyticsRequestDTO,
  ProjectReportAnalyticsResponseDTO,
} from "application/dto/dashboard/projectReportAnalyticsDTO";

export class GetProjectReportAnalyticsUseCase implements IGetProjectReportAnalyticsUseCase {
  constructor(private _reportRepo: IProjectMonthlyReportRepository) {}

  async execute(
    dto: GetProjectReportAnalyticsRequestDTO
  ): Promise<ProjectReportAnalyticsResponseDTO> {
    const filter: {
      fromDate?: Date;
      toDate?: Date;
      month?: string;
      year?: number;
    } = {};

    if (dto.fromDate) filter.fromDate = new Date(dto.fromDate);
    if (dto.toDate) filter.toDate = new Date(dto.toDate);
    if (dto.month) filter.month = dto.month;
    if (dto.year !== undefined) filter.year = dto.year;

    const reports = await this._reportRepo.findReportsForAnalytics(dto.projectId, filter);

    console.log("Fetched reports for analytics:", reports);

    return {
      projectId: dto.projectId,
      reports: reports.map((r) => ({
        month: r.month,
        year: r.year,
        revenue: r.revenue,
        expenditure: r.expenditure,
        netProfitLossAmount: r.netProfitLossAmount,
        keyAchievements: r.keyAchievement,
        challenges: r.challenges,
        netProfitLossType: r.netProfitLossType,
      })),
    };
  }
}
