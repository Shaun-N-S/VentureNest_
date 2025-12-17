import { UserRole } from "@domain/enum/userRole";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ILikeProjectUseCase } from "@domain/interfaces/useCases/project/ILikeProjectUseCase";
import { PROJECT_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";

export class LikeProjectUseCase implements ILikeProjectUseCase {
  constructor(private _projectRepo: IProjectRepository) {}

  async execute(
    projectId: string,
    likerId: string,
    likerRole: UserRole
  ): Promise<{ liked: boolean; likeCount: number; projectId: string }> {
    const project = await this._projectRepo.findById(projectId);
    console.log("project data from backend  : ", project);
    if (!project) throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);

    const alreadyLiked = project.likes.some((l) => l.likerId.toString() === likerId);

    if (alreadyLiked) {
      await this._projectRepo.removeLike(projectId, likerId);
    } else {
      await this._projectRepo.addLike(projectId, likerId, likerRole);
    }

    const updated = await this._projectRepo.findById(projectId);

    return {
      projectId,
      liked: !alreadyLiked,
      likeCount: updated!.likeCount,
    };
  }
}
