import { CreateProjectMonthlyReportDTO } from "application/dto/project/projectMonthlyReportDTO";

export interface ICreateProjectMonthlyReportUseCase {
  createMonthlyReport(data: CreateProjectMonthlyReportDTO): Promise<void>;
}
