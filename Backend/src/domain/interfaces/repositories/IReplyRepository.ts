import { IBaseRepository } from "./IBaseRepository";
import { ReplyEntity } from "@domain/entities/replies/repliesEntity";
import { PopulatedReply } from "application/type/populatedReply.type";

export interface IReplyRepository extends IBaseRepository<ReplyEntity> {
  findRepliesByComment(
    commentId: string,
    skip: number,
    limit: number
  ): Promise<{ replies: PopulatedReply[]; total: number }>;
}
