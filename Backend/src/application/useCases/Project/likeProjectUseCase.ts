import { UserRole } from "@domain/enum/userRole";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ILikeProjectUseCase } from "@domain/interfaces/useCases/project/ILikeProjectUseCase";

export class LikeProjectUseCase implements ILikeProjectUseCase {
  constructor(private _projectRepo: IProjectRepository) {}

  async execute(projectId: string, likerId: string, likerRole: UserRole) {
    const result = await this._projectRepo.toggleLike(projectId, likerId, likerRole);

    return {
      projectId,
      liked: result.liked,
      likeCount: result.likeCount,
    };
  }
}
