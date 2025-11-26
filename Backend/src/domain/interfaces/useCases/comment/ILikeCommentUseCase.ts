import { UserRole } from "@domain/enum/userRole";

export interface ILikeCommentUseCase {
  execute(
    commentId: string,
    likerId: string,
    likerRole: UserRole
  ): Promise<{
    liked: boolean;
    likeCount: number;
  }>;
}
