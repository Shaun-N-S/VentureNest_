import { UserRole } from "@domain/enum/userRole";

export interface CommentEntity {
  _id?: string;

  postId: string;
  userId: string;
  userRole: UserRole;

  commentText: string;

  likes: { likerId: string; likerRole: UserRole }[];
  likeCount: number;

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
