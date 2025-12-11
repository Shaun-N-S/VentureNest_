import { ProjectRegistrationEntity } from "@domain/entities/project/projectRegistrationEntity";
import { BaseRepository } from "./baseRepository";
import { IProjectRegistrationModel } from "@infrastructure/db/models/projectRegistrationModel";
import { IProjectRegistrationRepository } from "@domain/interfaces/repositories/IProjectRegistrationRepository";
import { Model } from "mongoose";
import { ProjectRegistrationMapper } from "application/mappers/projectRegistrationMapper";

export class ProjectRegistrationRepository
  extends BaseRepository<ProjectRegistrationEntity, IProjectRegistrationModel>
  implements IProjectRegistrationRepository
{
  constructor(protected _model: Model<IProjectRegistrationModel>) {
    super(_model, ProjectRegistrationMapper);
  }

  async findRegistrationByProjectId(projectId: string) {
    const doc = await this._model.findOne({ project_id: projectId });

    return doc ? ProjectRegistrationMapper.fromMongooseDocument(doc) : null;
  }

  async findRegistrationsByFounderId(founderId: string, skip: number, limit: number) {
    const filter = { founder_id: founderId };

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

  async verifyProjectRegistration(registrationId: string, status: string, verifyProfile: boolean) {
    const updatedDoc = await this._model.findByIdAndUpdate(
      registrationId,
      { status, verifyProfile },
      { new: true }
    );

    return updatedDoc ? ProjectRegistrationMapper.fromMongooseDocument(updatedDoc) : null;
  }
}
