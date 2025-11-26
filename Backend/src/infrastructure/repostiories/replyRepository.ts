import { BaseRepository } from "./baseRepository";
import { IReplyRepository } from "@domain/interfaces/repositories/IReplyRepository";
import { Model } from "mongoose";
import { IReplyModel } from "@infrastructure/db/models/replyModel";
import { ReplyEntity } from "@domain/entities/replies/repliesEntity";
import { PopulatedReply } from "application/type/populatedReply.type";
import { ReplyMapper } from "application/mappers/replyMapper";

export class ReplyRepository
  extends BaseRepository<ReplyEntity, IReplyModel>
  implements IReplyRepository
{
  constructor(protected _model: Model<IReplyModel>) {
    super(_model, ReplyMapper);
  }

  async findRepliesByComment(
    commentId: string,
    skip: number,
    limit: number
  ): Promise<{ replies: PopulatedReply[]; total: number }> {
    const [docs, total] = await Promise.all([
      this._model
        .find({ commentId })
        .populate("user")
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit),

      this._model.countDocuments({ commentId }),
    ]);

    return { replies: docs as PopulatedReply[], total };
  }
}
