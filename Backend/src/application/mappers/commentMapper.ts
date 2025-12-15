import mongoose from "mongoose";
import { CommentEntity } from "@domain/entities/comment/commentEntity";
import {
  CommentFeedDTO,
  CommentResDTO,
  CreateCommentEntityDTO,
} from "application/dto/comment/commentDTO";
import { PopulatedComment } from "application/type/comment.type";

export class CommentMapper {
  static toDTO(entity: CommentEntity): CommentResDTO {
    return {
      _id: entity._id!,
      postId: entity.postId,
      userId: entity.userId,
      userRole: entity.userRole,
      commentText: entity.commentText,
      repliesCount: entity.repliesCount ?? 0,
      likes: entity.likes ?? [],
      likeCount: entity.likeCount ?? 0,
      isDeleted: entity.isDeleted ?? false,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static fromMongooseDocument(doc: PopulatedComment): CommentEntity {
    return {
      _id: doc._id.toString(),
      postId: doc.postId.toString(),
      userId: doc.userId.toString(),
      userRole: doc.userRole,
      commentText: doc.commentText,
      repliesCount: doc.repliesCount || 0,
      likes: doc.likes.map((like) => ({
        likerId: like.likerId.toString(),
        likerRole: like.likerRole,
      })),
      likeCount: doc.likeCount,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toMongooseDocument(entity: CommentEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      postId: new mongoose.Types.ObjectId(entity.postId),
      userId: new mongoose.Types.ObjectId(entity.userId),
      userRole: entity.userRole,
      commentText: entity.commentText,
      repliesCount: entity.repliesCount,
      likes: entity.likes,
      likeCount: entity.likeCount,
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static createToEntity(dto: CreateCommentEntityDTO): CommentEntity {
    const now = new Date();

    return {
      postId: dto.postId,
      userId: dto.userId,
      userRole: dto.userRole,
      commentText: dto.commentText,
      repliesCount: 0,
      likes: [],
      likeCount: 0,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  static toFeedDTO(entity: PopulatedComment, currentUserId?: string): CommentFeedDTO {
    const liked = entity.likes.some((like) => like.likerId.toString() === currentUserId);

    return {
      _id: entity._id.toString(),
      postId: entity.postId.toString(),
      userId: entity.userId.toString(),
      userRole: entity.userRole,
      userName: entity.user?.userName || "Unknown",
      userProfileImg: entity.user?.profileImg || "",
      commentText: entity.commentText,
      likes: entity.likeCount,
      repliesCount: entity.repliesCount || 0,
      liked,
      createdAt: entity.createdAt!,
    };
  }
}
