import { ProjectResDTO } from "application/dto/project/projectDTO";

export interface IFetchProjectByIdUseCase {
  fetchProjectById(id: string): Promise<ProjectResDTO>;
}
