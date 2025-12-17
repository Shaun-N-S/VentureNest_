import { ProjectResDTO } from "application/dto/project/projectDTO";

export interface IFetchProjectByIdUseCase {
  fetchProjectById(projectId: string, userId: string): Promise<ProjectResDTO>;
}
