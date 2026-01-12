import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { IGetReportedProjectsUseCase } from "@domain/interfaces/useCases/admin/report/IGetReportedProjectsUseCase";
import { AdminReportedProjectDTO } from "application/dto/report/adminReportDTO";

export class GetReportedProjectsUseCase implements IGetReportedProjectsUseCase {
  constructor(private _reportRepository: IReportRepository) {}

  async execute(): Promise<AdminReportedProjectDTO[]> {
    return this._reportRepository.getReportedProjects();
  }
}
