import { ReportReason } from "@domain/enum/reportReason";
import { ReportStatus } from "@domain/enum/reportStatus";
import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { IGetReportedProjectsUseCase } from "@domain/interfaces/useCases/admin/report/IGetReportedProjectsUseCase";
import { PaginatedResponseDTO } from "application/dto/common/paginatedResponseDTO";
import { AdminReportedProjectDTO } from "application/dto/report/adminReportDTO";

export class GetReportedProjectsUseCase implements IGetReportedProjectsUseCase {
  constructor(private _reportRepository: IReportRepository) {}

  async execute(params: {
    page: number;
    limit: number;
    status?: ReportStatus;
    reason?: ReportReason;
  }): Promise<PaginatedResponseDTO<AdminReportedProjectDTO>> {
    const { page, limit, status, reason } = params;

    const skip = (page - 1) * limit;

    const { data, total } = await this._reportRepository.getReportedProjects({
      skip,
      limit,
      ...(status && { status }),
      ...(reason && { reason }),
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }
}
