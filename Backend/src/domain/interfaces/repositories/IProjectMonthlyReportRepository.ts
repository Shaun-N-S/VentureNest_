import { ProjectMonthlyReportEntity } from "domain/entities/project/projectMonthlyReportEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IProjectMonthlyReportRepository
  extends IBaseRepository<ProjectMonthlyReportEntity> {
  findReportsByProjectId(
    projectId: string,
    skip: number,
    limit: number
  ): Promise<{
    reports: ProjectMonthlyReportEntity[];
    total: number;
    hasNextPage: boolean;
  }>;

  findReportByMonth(
    projectId: string,
    month: string,
    year: number
  ): Promise<ProjectMonthlyReportEntity | null>;
}
