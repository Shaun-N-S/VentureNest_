import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { ReportEntity } from "@domain/entities/report/reportEntity";
import { IReportModel } from "@infrastructure/db/models/reportModel";
import { ReportMapper } from "application/mappers/reportMapper";
import { ReportStatus } from "@domain/enum/reportStatus";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReporterType } from "@domain/enum/reporterRole";

export class ReportRepository
  extends BaseRepository<ReportEntity, IReportModel>
  implements IReportRepository
{
  constructor(protected _model: Model<IReportModel>) {
    super(_model, ReportMapper);
  }

  async existsDuplicate(
    reportedById: string,
    reportedByType: ReporterType,
    targetType: ReportTargetType,
    targetId: string
  ): Promise<boolean> {
    const count = await this._model.countDocuments({
      reportedById: new mongoose.Types.ObjectId(reportedById),
      reportedByType,
      targetType,
      targetId: new mongoose.Types.ObjectId(targetId),
    });

    return count > 0;
  }

  async findByTarget(targetType: ReportTargetType, targetId: string): Promise<ReportEntity[]> {
    const docs = await this._model.find({
      targetType,
      targetId: new mongoose.Types.ObjectId(targetId),
    });

    return docs.map((doc) => ReportMapper.fromMongooseDocument(doc));
  }

  async updateStatus(reportId: string, status: ReportStatus): Promise<ReportEntity | null> {
    const updated = await this._model.findByIdAndUpdate(
      reportId,
      {
        status,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    return updated ? ReportMapper.fromMongooseDocument(updated) : null;
  }
}
