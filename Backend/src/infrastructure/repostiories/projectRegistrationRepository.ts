import { ProjectRegistrationEntity } from "@domain/entities/project/projectRegistrationEntity";
import { BaseRepository } from "./baseRepository";
import { IProjectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";
import { IProjectRegistrationRepository } from "@domain/interfaces/repositories/IProjectRegistrationRepository";
import { ClientSession, Model, PipelineStage } from "mongoose";
import { ProjectRegistrationMapper } from "application/mappers/projectRegistrationMapper";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { PopulatedProjectRegistrationRepoDTO } from "application/dto/admin/projectRegistrationRepoDTO";

export class ProjectRegistrationRepository
  extends BaseRepository<ProjectRegistrationEntity, IProjectRegistrationModel>
  implements IProjectRegistrationRepository
{
  constructor(protected _model: Model<IProjectRegistrationModel>) {
    super(_model, ProjectRegistrationMapper);
  }

  async findRegistrationByProjectId(projectId: string, session?: ClientSession) {
    const doc = await this._model.findOne({ projectId }).session(session!);
    return doc ? ProjectRegistrationMapper.fromMongooseDocument(doc) : null;
  }

  async findRegistrationsByFounderId(founderId: string, skip: number, limit: number) {
    const filter = { founderId };

    const [docs, total] = await Promise.all([
      this._model.find(filter).skip(skip).limit(limit),
      this._model.countDocuments(filter),
    ]);

    return {
      registrations: docs.map((doc) => ProjectRegistrationMapper.fromMongooseDocument(doc)),
      total,
      hasNextPage: skip + docs.length < total,
    };
  }

  async verifyProjectRegistration(
    registrationId: string,
    status: ProjectRegistrationStatus,
    rejectionReason?: string
  ): Promise<ProjectRegistrationEntity | null> {
    const updateData: {
      status: ProjectRegistrationStatus;
      rejectionReason?: string | null;
    } = {
      status,
    };

    if (status === ProjectRegistrationStatus.REJECTED) {
      updateData.rejectionReason = rejectionReason ?? "No reason provided";
    } else {
      updateData.rejectionReason = null;
    }

    const updatedDoc = await this._model.findByIdAndUpdate(registrationId, updateData, {
      new: true,
    });

    return updatedDoc ? ProjectRegistrationMapper.fromMongooseDocument(updatedDoc) : null;
  }

  async findAllAdmin(
    skip: number,
    limit: number,
    status?: ProjectRegistrationStatus,
    search?: string
  ): Promise<PopulatedProjectRegistrationRepoDTO[]> {
    const pipeline: PipelineStage[] = [];

    const matchFilter: Record<string, unknown> = {};
    if (status) {
      matchFilter.status = status;
    }

    pipeline.push({ $match: matchFilter });

    // Lookup Project
    pipeline.push({
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    });

    pipeline.push({ $unwind: "$project" });

    // Lookup Founder
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "founderId",
        foreignField: "_id",
        as: "founder",
      },
    });

    pipeline.push({ $unwind: "$founder" });

    // Search
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "project.startupName": { $regex: search, $options: "i" } },
            { "founder.userName": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Projection (CRITICAL FIX)
    pipeline.push({
      $project: {
        _id: 1,
        project: {
          _id: "$project._id",
          startupName: "$project.startupName",
          logoUrl: "$project.logoUrl",
          coverImageUrl: "$project.coverImageUrl",
        },
        founder: {
          _id: "$founder._id",
          userName: "$founder.userName",
          profileImg: "$founder.profileImg",
        },
        gstCertificateUrl: 1,
        companyRegistrationCertificateUrl: 1,
        cinNumber: 1,
        country: 1,
        declarationAccepted: 1,
        status: 1,
        rejectionReason: 1,
        createdAt: 1,
      },
    });

    pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });

    return this._model.aggregate<PopulatedProjectRegistrationRepoDTO>(pipeline);
  }

  async countAdmin(status?: ProjectRegistrationStatus, search?: string): Promise<number> {
    const pipeline: PipelineStage[] = [];

    const matchFilter: Record<string, unknown> = {};
    if (status) {
      matchFilter.status = status;
    }

    pipeline.push({ $match: matchFilter });

    pipeline.push({
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    });

    pipeline.push({ $unwind: "$project" });

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "founderId",
        foreignField: "_id",
        as: "founder",
      },
    });

    pipeline.push({ $unwind: "$founder" });

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "project.startupName": { $regex: search, $options: "i" } },
            { "founder.userName": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push({ $count: "total" });

    const result = await this._model.aggregate<{ total: number }>(pipeline);

    return result?.[0]?.total ?? 0;
  }

  async findByIdPopulated(
    registrationId: string
  ): Promise<PopulatedProjectRegistrationRepoDTO | null> {
    const doc = await this._model
      .findById(registrationId)
      .populate("projectId", "startupName logoUrl coverImageUrl")
      .populate("founderId", "userName profileImg")
      .lean();

    if (!doc) return null;

    return doc as unknown as PopulatedProjectRegistrationRepoDTO;
  }
}
