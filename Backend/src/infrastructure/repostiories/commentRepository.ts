import { BaseRepository } from "./baseRepository";
import { ICommentRepository } from "@domain/interfaces/repositories/ICommentRepository";
import { Model } from "mongoose";
import { ICommentModel } from "@infrastructure/db/models/commentModel";
import { CommentEntity } from "@domain/entities/comment/commentEntity";
import { PopulatedComment } from "application/type/comment.type";
import { CommentMapper } from "application/mappers/commentMapper";
import { UserRole } from "@domain/enum/userRole";

export class CommentRepository
  extends BaseRepository<CommentEntity, ICommentModel>
  implements ICommentRepository
{
  constructor(protected _model: Model<ICommentModel>) {
    super(_model, CommentMapper);
  }

  async findCommentsByPost(postId: string, skip: number, limit: number) {
    const [docs, total] = await Promise.all([
      this._model
        .find({ postId, isDeleted: false })
        .populate("user")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments({ postId, isDeleted: false }),
    ]);

    return { comments: docs as PopulatedComment[], total };
  }

  async addLike(commentId: string, likerId: string, likerRole: UserRole) {
    await this._model.updateOne(
      { _id: commentId },
      {
        $push: { likes: { likerId, likerRole } },
        $inc: { likeCount: 1 },
      }
    );
  }

  async removeLike(commentId: string, likerId: string) {
    await this._model.updateOne(
      { _id: commentId },
      {
        $pull: { likes: { likerId } },
        $inc: { likeCount: -1 },
      }
    );
  }
}
