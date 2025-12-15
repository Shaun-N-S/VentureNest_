import mongoose from "mongoose";
import { ReplyEntity } from "@domain/entities/replies/repliesEntity";
import { ReplyFeedDTO, CreateReplyDTO } from "application/dto/reply/replyDTO";
import { PopulatedReply } from "application/type/populatedReply.type";

export class ReplyMapper {
  /** ---------- DTO → Entity ---------- **/
  static createToEntity(dto: CreateReplyDTO): ReplyEntity {
    const now = new Date();

    return {
      commentId: dto.commentId,
      replierId: dto.replierId,
      replierRole: dto.replierRole,
      replyText: dto.replyText,
      likes: [],
      likeCount: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  /** ---------- Mongoose Document → Entity ---------- **/
  static fromMongooseDocument(doc: PopulatedReply): ReplyEntity {
    return {
      _id: doc._id.toString(),
      commentId: doc.commentId.toString(),
      replierId: doc.replierId.toString(),
      replierRole: doc.replierRole,
      replyText: doc.replyText,
      likes: doc.likes.map((like) => ({
        likerId: like.likerId.toString(),
        likerRole: like.likerRole,
      })),
      likeCount: doc.likeCount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /** ---------- Entity → Mongoose Insertable Object ---------- **/
  static toMongooseDocument(entity: ReplyEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      commentId: new mongoose.Types.ObjectId(entity.commentId),
      replierId: new mongoose.Types.ObjectId(entity.replierId),
      replierRole: entity.replierRole,
      replyText: entity.replyText,
      likes:
        entity.likes?.map((like) => ({
          likerId: new mongoose.Types.ObjectId(like.likerId),
          likerRole: like.likerRole,
        })) ?? [],
      likeCount: entity.likeCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /** ---------- Entity → Feed DTO ---------- **/
  static toFeedDTO(entity: PopulatedReply, currentUserId?: string): ReplyFeedDTO {
    const liked = entity.likes.some((like) => like.likerId.toString() === currentUserId);
    return {
      _id: entity._id.toString(),
      commentId: entity.commentId.toString(),
      replierId: entity.replierId.toString(),
      replierRole: entity.replierRole,
      replierName: entity.user?.userName || "Unknown",
      replierProfileImg: entity.user?.profileImg || "",
      replyText: entity.replyText,
      likes: entity.likeCount,
      liked,
      createdAt: entity.createdAt!,
    };
  }
}
