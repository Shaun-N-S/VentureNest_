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
}
