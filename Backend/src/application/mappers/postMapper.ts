// src/application/mappers/postMapper.ts
import { PostEntity } from "@domain/entities/post/postEntity";
import { PostResDTO, CreatePostDTO } from "application/dto/post/postDTO";

export class PostMapper {
  // For response: Entity → DTO
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
      likeCount: data.likeCount ?? 0,
      commentsCount: data.commentsCount ?? 0,
      isActive: data.isActive ?? true,
      isDeleted: data.isDeleted ?? false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  // For update: DTO → Entity (full)
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

  // NEW: For creating new post
  static createToEntity(dto: CreatePostDTO): PostEntity {
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
}
