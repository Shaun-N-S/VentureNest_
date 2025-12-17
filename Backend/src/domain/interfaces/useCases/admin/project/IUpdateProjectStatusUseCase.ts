import { UserStatus } from "@domain/enum/userStatus";
import { ProjectResDTO } from "application/dto/project/projectDTO";

export interface IUpdateProjectStatusUseCase {
  updateProjectStatus(
    projectId: string,
    currentStatus: UserStatus
  ): Promise<{
    project: ProjectResDTO;
  }>;
}
