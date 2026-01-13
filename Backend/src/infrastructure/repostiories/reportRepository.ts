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
import { ReportReason } from "@domain/enum/reportReason";

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

  async getReportedPosts(params: {
    skip: number;
    limit: number;
    status?: ReportStatus;
    reason?: ReportReason;
  }) {
    const { skip, limit, status, reason } = params;

    const match: any = {
      targetType: ReportTargetType.POST,
    };

    if (status) match.status = status;
    if (reason) match.reasonCode = reason;

    const [data, totalAgg] = await Promise.all([
      this._model.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$targetId",
            postId: { $first: "$targetId" },
            reportCount: { $sum: 1 },
            reasons: { $addToSet: "$reasonCode" },
            latestReportAt: { $max: "$createdAt" },
            status: { $first: "$status" },
          },
        },
        { $sort: { latestReportAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            postId: { $toString: "$postId" },
            reportCount: 1,
            reasons: 1,
            latestReportAt: 1,
            status: 1,
          },
        },
      ]),
      this._model.aggregate([
        { $match: match },
        { $group: { _id: "$targetId" } },
        { $count: "total" },
      ]),
    ]);

    return {
      data,
      total: totalAgg[0]?.total ?? 0,
    };
  }

  async getReportedProjects(params: {
    skip: number;
    limit: number;
    status?: ReportStatus;
    reason?: ReportReason;
  }): Promise<{ data: AdminReportedProjectDTO[]; total: number }> {
    const { skip, limit, status, reason } = params;

    const match: any = {
      targetType: ReportTargetType.PROJECT,
    };

    if (status) match.status = status;
    if (reason) match.reasonCode = reason;

    const [data, totalResult] = await Promise.all([
      this._model.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$targetId",
            projectId: { $first: "$targetId" },
            reportCount: { $sum: 1 },
            reasons: { $addToSet: "$reasonCode" },
            latestReportAt: { $max: "$createdAt" },
            status: { $first: "$status" },
          },
        },
        { $sort: { latestReportAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            projectId: { $toString: "$projectId" },
            reportCount: 1,
            reasons: 1,
            latestReportAt: 1,
            status: 1,
          },
        },
      ]),

      this._model.countDocuments(match),
    ]);

    return {
      data,
      total: totalResult,
    };
  }
}
