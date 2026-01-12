import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IReportRepository } from "@domain/interfaces/repositories/IReportRepository";
import { ReportEntity } from "@domain/entities/report/reportEntity";
import { IReportModel } from "@infrastructure/db/models/reportModel";
import { ReportMapper } from "application/mappers/reportMapper";
import { ReportStatus } from "@domain/enum/reportStatus";
import { ReportTargetType } from "@domain/enum/reporterTarget";
import { ReporterType } from "@domain/enum/reporterRole";
import {
  AdminReportedPostDTO,
  AdminReportedProjectDTO,
} from "application/dto/report/adminReportDTO";

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

  async updateStatus(
    reportId: string,
    status: ReportStatus,
    reviewedBy: string,
    actionTaken?: string
  ) {
    const updated = await this._model.findByIdAndUpdate(
      reportId,
      {
        status,
        reviewedBy: new mongoose.Types.ObjectId(reviewedBy),
        reviewedAt: new Date(),
        ...(actionTaken && { actionTaken }),
      },
      { new: true }
    );

    return updated ? ReportMapper.fromMongooseDocument(updated) : null;
  }

  async getReportedPosts(): Promise<AdminReportedPostDTO[]> {
    const result = await this._model.aggregate([
      {
        $match: {
          targetType: "post",
        },
      },
      {
        $group: {
          _id: "$targetId",
          reportCount: { $sum: 1 },
          reasons: { $addToSet: "$reasonCode" },
          latestReportAt: { $max: "$createdAt" },
          status: { $first: "$status" },
        },
      },
      {
        $project: {
          _id: 0,
          postId: { $toString: "$_id" },
          reportCount: 1,
          reasons: 1,
          latestReportAt: 1,
          status: 1,
        },
      },
      {
        $sort: {
          reportCount: -1,
          latestReportAt: -1,
        },
      },
    ]);

    return result;
  }

  async getReportedProjects(): Promise<AdminReportedProjectDTO[]> {
    const result = await this._model.aggregate([
      {
        $match: {
          targetType: "project",
        },
      },
      {
        $group: {
          _id: "$targetId",
          reportCount: { $sum: 1 },
          reasons: { $addToSet: "$reasonCode" },
          latestReportAt: { $max: "$createdAt" },
          status: { $last: "$status" }, // latest status wins
        },
      },
      {
        $project: {
          _id: 0,
          projectId: { $toString: "$_id" },
          reportCount: 1,
          reasons: 1,
          latestReportAt: 1,
          status: 1,
        },
      },
      {
        $sort: {
          reportCount: -1,
          latestReportAt: -1,
        },
      },
    ]);

    return result;
  }
}
