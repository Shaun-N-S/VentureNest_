import { AdminReportedProjectDTO } from "application/dto/report/adminReportDTO";

export interface IGetReportedProjectsUseCase {
  execute(): Promise<AdminReportedProjectDTO[]>;
}
