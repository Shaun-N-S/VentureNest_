import { UserRole } from "@domain/enum/userRole";

export interface ILikeProjectUseCase {
  execute(
    projectId: string,
    likerId: string,
    likerRole: UserRole
  ): Promise<{ liked: boolean; likeCount: number; projectId: string }>;
}
