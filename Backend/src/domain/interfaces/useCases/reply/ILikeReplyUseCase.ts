import { UserRole } from "@domain/enum/userRole";

export interface ILikeReplyUseCase {
  execute(
    replyId: string,
    likerId: string,
    likerRole: UserRole
  ): Promise<{ liked: boolean; likeCount: number }>;
}
