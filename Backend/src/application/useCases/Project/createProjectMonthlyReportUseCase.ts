import { ICreateProjectMonthlyReportUseCase } from "@domain/interfaces/useCases/project/ICreateProjectMonthlyReportUseCase";
import { IProjectMonthlyReportRepository } from "@domain/interfaces/repositories/IProjectMonthlyReportRepository";
import { CreateProjectMonthlyReportDTO } from "application/dto/project/projectMonthlyReportDTO";
import { ProjectMonthlyReportMapper } from "application/mappers/projectMontlyReportMapper";

export class CreateProjectMonthlyReportUseCase implements ICreateProjectMonthlyReportUseCase {
  constructor(private _reportRepository: IProjectMonthlyReportRepository) {}

  async createMonthlyReport(data: CreateProjectMonthlyReportDTO): Promise<void> {
    const reportEntity = ProjectMonthlyReportMapper.createToEntity(data);

    await this._reportRepository.save(reportEntity);
  }
}
