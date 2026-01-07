import { CreateReportDTO } from "application/dto/report/createReportDTO";

export interface ICreateReportUseCase {
  createReport(data: CreateReportDTO): Promise<{ reportId: string }>;
}
