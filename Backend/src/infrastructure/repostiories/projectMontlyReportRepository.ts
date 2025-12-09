// ProjectMonthlyReportRepository.ts
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
}
