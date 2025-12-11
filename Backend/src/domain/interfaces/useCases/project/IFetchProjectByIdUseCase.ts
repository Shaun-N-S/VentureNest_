import { ProjectResDTO } from "application/dto/project/projectDTO";

export interface IFetchProjectByIdUseCase {
  fetchProjectById(projectId: string): Promise<ProjectResDTO>;
}
