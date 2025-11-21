import { CreateProjectDTO } from "application/dto/project/projectDTO";

export interface ICreateProjectUseCase {
  createProject(data: CreateProjectDTO): Promise<void>;
}
