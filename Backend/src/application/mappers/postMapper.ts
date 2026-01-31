import { InvestorEntity } from "@domain/entities/investor/investorEntity";
import { PostEntity } from "@domain/entities/post/postEntity";
import { UserEntity } from "@domain/entities/user/userEntity";
import { UserRole } from "@domain/enum/userRole";
import { IPostModel } from "@infrastructure/db/models/postModel";
import { PostResDTO, CreatePostEntityDTO } from "application/dto/post/postDTO";
import { PostLikeUserDTO } from "application/dto/post/postLikeUserDTO";
import mongoose from "mongoose";

export class PostMapper {
  // Entity → DTO

  static fromMongooseDocument(doc: IPostModel): PostEntity {
    return {
      _id: doc._id.toString(),
      authorId: doc.authorId.toString(),
      authorRole: doc.authorRole || UserRole.INVESTOR,
      content: doc.content || "",
      mediaUrls: doc.mediaUrls || [],
      likes:
        doc.likes.map((doc) => ({ likerId: doc.likerId.toString(), likerRole: doc.likerRole })) ||
        [],
      likeCount: doc.likeCount || 0,
      commentsCount: doc.commentsCount || 0,
      isActive: doc.isActive ?? true,
      isDeleted: doc.isDeleted ?? false,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
    };
  }

  static toMongooseDocument(post: PostEntity) {
    return {
      _id: post._id ? new mongoose.Types.ObjectId(post._id) : undefined,
      authorId: new mongoose.Types.ObjectId(post.authorId),
      authorRole: post.authorRole,
      content: post.content,
      mediaUrls: post.mediaUrls,
      likes: post.likes,
      likeCount: post.likeCount,
      commentsCount: post.commentsCount,
      isActive: post.isActive,
      isDeleted: post.isDeleted,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static toDTO(data: PostEntity): PostResDTO {
    if (!data._id) throw new Error("Post _id is required for DTO");
    if (!data.createdAt || !data.updatedAt) {
      throw new Error("Timestamps required");
    }

    return {
      _id: data._id,
      authorId: data.authorId,
      authorRole: data.authorRole,
      content: data.content ?? "",
      mediaUrls: data.mediaUrls ?? [],
      likes: data.likes ?? [],
      liked: false,
      likeCount: data.likeCount ?? 0,
      commentsCount: data.commentsCount ?? 0,
      isActive: data.isActive ?? true,
      isDeleted: data.isDeleted ?? false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  //DTO → Entity
  static toEntity(dto: PostResDTO): PostEntity {
    return {
      _id: dto._id,
      authorId: dto.authorId,
      authorRole: dto.authorRole,
      content: dto.content,
      mediaUrls: dto.mediaUrls,
      likes: dto.likes,
      likeCount: dto.likeCount,
      commentsCount: dto.commentsCount,
      isActive: dto.isActive,
      isDeleted: dto.isDeleted,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static createToEntity(dto: CreatePostEntityDTO): PostEntity {
    const now = new Date();
    return {
      authorId: dto.authorId,
      authorRole: dto.authorRole,
      content: dto.content ?? "",
      mediaUrls: dto.mediaUrls ?? [],
      likes: [],
      likeCount: 0,
      commentsCount: 0,
      isActive: true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  static fromUser(user: UserEntity): PostLikeUserDTO {
    if (!user._id) {
      throw new Error("User _id is required for PostLikeUserDTO");
    }

    return {
      id: user._id,
      name: user.userName,
      ...(user.bio && { bio: user.bio }),
      ...(user.profileImg && { profileImg: user.profileImg }),
      role: UserRole.USER,
    };
  }

  static fromInvestor(investor: InvestorEntity): PostLikeUserDTO {
    if (!investor._id) {
      throw new Error("Investor _id is required for PostLikeUserDTO");
    }

    return {
      id: investor._id,
      name: investor.userName,
      ...(investor.bio && { bio: investor.bio }),
      ...(investor.profileImg && { profileImg: investor.profileImg }),
      role: UserRole.INVESTOR,
    };
  }
}
