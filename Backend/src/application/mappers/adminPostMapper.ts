import { PostEntity } from "@domain/entities/post/postEntity";
import { AdminPostResDTO } from "application/dto/post/postDTO";

export class AdminPostMapper {
  static toDTO(post: PostEntity): AdminPostResDTO {
    return {
      id: post._id!,
      ...(post.content && { content: post.content }),
      mediaUrls: post.mediaUrls ?? [],
      likeCount: post.likeCount,
      commentsCount: post.commentsCount,
      isActive: post.isActive,
      isDeleted: post.isDeleted,
      createdAt: post.createdAt!,

      author: {
        id: post.authorId,
        role: post.authorRole,
      },
    };
  }
}
