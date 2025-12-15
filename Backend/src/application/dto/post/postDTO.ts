import { UserRole } from "@domain/enum/userRole";

export interface PostResDTO {
  _id: string;
  authorId: string;
  authorRole: UserRole;
  content: string;
  mediaUrls: string[];
  likes: { likerId: string; likerRole: UserRole }[];
  likeCount: number;
  liked: boolean;
  commentsCount: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostFeedResDTO extends PostResDTO {
  authorName: string;
  authorProfileImg?: string | undefined;
  liked: boolean;
}

export interface CreatePostDTO {
  authorId: string;
  authorRole: UserRole;
  content?: string;
  mediaUrls?: File[];
}

export interface CreatePostEntityDTO {
  authorId: string;
  authorRole: UserRole;
  content?: string;
  mediaUrls?: string[];
}
