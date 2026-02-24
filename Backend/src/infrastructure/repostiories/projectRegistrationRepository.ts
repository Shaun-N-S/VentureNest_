import { ProjectRegistrationEntity } from "@domain/entities/project/projectRegistrationEntity";
import { BaseRepository } from "./baseRepository";
import { IProjectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";
import { IProjectRegistrationRepository } from "@domain/interfaces/repositories/IProjectRegistrationRepository";
import { ClientSession, Model } from "mongoose";
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
    status?: ProjectRegistrationStatus
  ): Promise<PopulatedProjectRegistrationRepoDTO[]> {
    const query: { status?: ProjectRegistrationStatus } = {};

    if (status) {
      query.status = status;
    }

    const docs = await this._model
      .find(query)
      .populate("projectId", "startupName logoUrl coverImageUrl")
      .populate("founderId", "userName profileImg")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return docs as unknown as PopulatedProjectRegistrationRepoDTO[];
  }

  async countAdmin(status?: ProjectRegistrationStatus): Promise<number> {
    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    return this._model.countDocuments(query);
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
