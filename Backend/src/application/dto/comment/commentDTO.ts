import { UserRole } from "@domain/enum/userRole";

export interface CommentResDTO {
  _id: string;
  postId: string;
  userId: string;
  userRole: UserRole;

  commentText: string;
  repliesCount: number;

  likes: { likerId: string; likerRole: UserRole }[];
  likeCount: number;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface CommentFeedDTO {
  _id: string;
  postId: string;
  userId: string;
  userRole: UserRole;
  userName: string;
  userProfileImg?: string;
  commentText: string;
  likes: number;
  repliesCount: number;
  createdAt: Date;
}

export interface GetCommentsQuery {
  postId: string;
  skip?: number;
  limit?: number;
}

export interface CreateCommentDTO {
  postId: string;
  userId: string;
  userRole: UserRole;
  commentText: string;
}

export interface CreateCommentEntityDTO {
  postId: string;
  userId: string;
  userRole: UserRole;
  commentText: string;
}
