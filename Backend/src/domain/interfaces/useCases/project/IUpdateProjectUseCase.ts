import { UpdateProjectDTO } from "application/dto/project/projectDTO";

export interface IUpdateProjectUseCase {
  updateProject(data: UpdateProjectDTO): Promise<{ projectId: string; logoUrl?: string }>;
}
