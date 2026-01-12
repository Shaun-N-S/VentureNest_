import {
  AdminUpdatedReportDTO,
  UpdateReportStatusDTO,
} from "application/dto/report/adminReportDTO";

export interface IUpdateReportStatusUseCase {
  execute(
    reportId: string,
    adminId: string,
    dto: UpdateReportStatusDTO
  ): Promise<AdminUpdatedReportDTO>;
}
