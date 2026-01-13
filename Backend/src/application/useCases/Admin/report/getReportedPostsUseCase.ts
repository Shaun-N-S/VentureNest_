import { ReportReason } from "@domain/enum/reportReason";
import { ReportStatus } from "@domain/enum/reportStatus";
import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { IGetReportedPostsUseCase } from "@domain/interfaces/useCases/admin/report/IGetReportedPostsUseCase";
import { PaginatedResponseDTO } from "application/dto/common/paginatedResponseDTO";
import { AdminReportedPostDTO } from "application/dto/report/adminReportDTO";

export class GetReportedPostsUseCase implements IGetReportedPostsUseCase {
  constructor(private _reportRepository: IReportRepository) {}

  async execute(params: {
    page: number;
    limit: number;
    status?: ReportStatus;
    reason?: ReportReason;
  }): Promise<PaginatedResponseDTO<AdminReportedPostDTO>> {
    const { page, limit, status, reason } = params;

    const skip = (page - 1) * limit;

    const { data, total } = await this._reportRepository.getReportedPosts({
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
