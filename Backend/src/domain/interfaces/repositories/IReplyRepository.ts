import { IBaseRepository } from "./IBaseRepository";
import { ReplyEntity } from "@domain/entities/replies/repliesEntity";
import { UserRole } from "@domain/enum/userRole";
import { PopulatedReply } from "application/type/populatedReply.type";

export interface IReplyRepository extends IBaseRepository<ReplyEntity> {
  findRepliesByComment(
    commentId: string,
    skip: number,
    limit: number
  ): Promise<{ replies: PopulatedReply[]; total: number }>;
  addLike(replyId: string, likerId: string, likerRole: UserRole): Promise<void>;
  removeLike(replyId: string, likerId: string): Promise<void>;
}
