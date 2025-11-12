import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IProjectRepository extends IBaseRepository<ProjectEntity> {}
