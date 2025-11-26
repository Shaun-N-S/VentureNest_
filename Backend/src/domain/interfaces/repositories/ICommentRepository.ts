import { IBaseRepository } from "./IBaseRepository";
import { CommentEntity } from "@domain/entities/comment/commentEntity";
import { UserRole } from "@domain/enum/userRole";
import { PopulatedComment } from "application/type/comment.type";

export interface ICommentRepository extends IBaseRepository<CommentEntity> {
  findCommentsByPost(
    postId: string,
    skip: number,
    limit: number
  ): Promise<{ comments: PopulatedComment[]; total: number }>;
  addLike(commentId: string, likerId: string, likerRole: UserRole): Promise<void>;
  removeLike(commentId: string, likerId: string): Promise<void>;
}
