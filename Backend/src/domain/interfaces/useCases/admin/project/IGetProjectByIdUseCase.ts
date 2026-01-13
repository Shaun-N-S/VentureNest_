import { AdminProjectResDTO } from "application/dto/project/projectDTO";

export interface IGetProjectByIdUseCase {
  execute(projectId: string): Promise<AdminProjectResDTO>;
}
