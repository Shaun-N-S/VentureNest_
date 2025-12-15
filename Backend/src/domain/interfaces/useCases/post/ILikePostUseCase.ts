import { UserRole } from "@domain/enum/userRole";

export interface ILikePostUseCase {
  execute(
    postId: string,
    likerId: string,
    likerRole: UserRole
  ): Promise<{
    liked: boolean;
    likeCount: number;
    postId: string;
  }>;
}
