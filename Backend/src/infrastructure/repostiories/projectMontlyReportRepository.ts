import { ProjectMonthlyReportEntity } from "@domain/entities/project/projectMonthlyReportEntity";
import { BaseRepository } from "./baseRepository";
import { IProjectMonthlyReportModel } from "@infrastructure/db/models/projectMonthlyReportModel";
import { IProjectMonthlyReportRepository } from "@domain/interfaces/repositories/IProjectMonthlyReportRepository";
import { Model } from "mongoose";
import { ProjectMonthlyReportMapper } from "application/mappers/projectMontlyReportMapper";

export class ProjectMonthlyReportRepository
  extends BaseRepository<ProjectMonthlyReportEntity, IProjectMonthlyReportModel>
  implements IProjectMonthlyReportRepository
{
  constructor(protected _model: Model<IProjectMonthlyReportModel>) {
    super(_model, ProjectMonthlyReportMapper);
  }

  async findReportsByProjectId(projectId: string, skip: number, limit: number) {
    const filter = { projectId };

    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ year: -1, month: -1 }).skip(skip).limit(limit),

      this._model.countDocuments(filter),
    ]);

    return {
      reports: docs.map((doc) => ProjectMonthlyReportMapper.fromMongooseDocument(doc)),
      total,
      hasNextPage: skip + docs.length < total,
    };
  }

  async findReportByMonth(projectId: string, month: string, year: number) {
    const doc = await this._model.findOne({ projectId, month, year });

    return doc ? ProjectMonthlyReportMapper.fromMongooseDocument(doc) : null;
  }

  async findLatestByProjectId(projectId: string): Promise<ProjectMonthlyReportEntity | null> {
    const doc = await this._model.findOne({ projectId }).sort({ year: -1, month: -1 });

    return doc ? ProjectMonthlyReportMapper.fromMongooseDocument(doc) : null;
  }

  async findReportsForAnalytics(
    projectId: string,
    filters: {
      fromDate?: Date;
      toDate?: Date;
      month?: string;
      year?: number;
    }
  ): Promise<ProjectMonthlyReportEntity[]> {
    const query: any = { projectId };

    if (filters.month) {
      query.month = filters.month;
    }

    if (filters.year) {
      query.year = filters.year;
    }

    const docs = await this._model.find(query);

    let filteredDocs = docs;

    if (filters.fromDate || filters.toDate) {
      const from = filters.fromDate ? new Date(filters.fromDate) : null;
      const to = filters.toDate ? new Date(filters.toDate) : null;

      filteredDocs = docs.filter((doc) => {
        const reportMonth = new Date(`${doc.month} 1, ${doc.year}`).getMonth();
        const reportYear = doc.year;

        if (from) {
          const fromMonth = from.getMonth();
          const fromYear = from.getFullYear();

          if (reportYear < fromYear || (reportYear === fromYear && reportMonth < fromMonth)) {
            return false;
          }
        }

        if (to) {
          const toMonth = to.getMonth();
          const toYear = to.getFullYear();

          if (reportYear > toYear || (reportYear === toYear && reportMonth > toMonth)) {
            return false;
          }
        }

        return true;
      });
    }

    filteredDocs.sort((a, b) => {
      const d1 = new Date(`${a.month} 1, ${a.year}`).getTime();
      const d2 = new Date(`${b.month} 1, ${b.year}`).getTime();
      return d1 - d2;
    });

    return filteredDocs.map(ProjectMonthlyReportMapper.fromMongooseDocument);
  }
}
