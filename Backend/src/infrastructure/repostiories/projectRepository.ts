// ProjectRepository.ts
import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { BaseRepository } from "./baseRepository";
import { IProjectModel } from "@infrastructure/db/models/projectModel";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { Model } from "mongoose";
import { ProjectMapper } from "application/mappers/projectMapper";

export class ProjectRepository
  extends BaseRepository<ProjectEntity, IProjectModel>
  implements IProjectRepository
{
  constructor(protected _model: Model<IProjectModel>) {
    super(_model, ProjectMapper);
  }

  async findPersonalProjects(userId: string, skip: number, limit: number) {
    const [docs, total] = await Promise.all([
      this._model.find({ userId, isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._model.countDocuments({ userId }),
    ]);

    return {
      projects: docs.map((doc) => ProjectMapper.fromMongooseDocument(doc)),
      total,
    };
  }

  async findAllProjects(skip: number, limit: number) {
    const filter = { isActive: true };

    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._model.countDocuments(filter),
    ]);

    return {
      projects: docs.map((doc) => ProjectMapper.fromMongooseDocument(doc)),
      total,
      hasNextPage: skip + docs.length < total,
    };
  }
}
