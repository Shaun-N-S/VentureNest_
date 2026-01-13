import { AdminProjectReportDetailDTO } from "application/dto/report/adminReportDTO";

export interface IGetProjectReportsUseCase {
  execute(projectId: string): Promise<AdminProjectReportDetailDTO[]>;
}
