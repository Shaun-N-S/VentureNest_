import { ReportReason } from "@domain/enum/reportReason";
import { ReportStatus } from "@domain/enum/reportStatus";
import { PaginatedResponseDTO } from "application/dto/common/paginatedResponseDTO";
import { AdminReportedPostDTO } from "application/dto/report/adminReportDTO";

export interface IGetReportedPostsUseCase {
  execute(params: {
    page: number;
    limit: number;
    status?: ReportStatus;
    reason?: ReportReason;
  }): Promise<PaginatedResponseDTO<AdminReportedPostDTO>>;
}
