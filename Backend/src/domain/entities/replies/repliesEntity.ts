import { UserRole } from "@domain/enum/userRole";

export interface ReplyEntity {
  _id?: string;

  commentId: string;
  replierId: string;
  replierRole: UserRole;

  replyText: string;

  likes: { likerId: string; likerRole: UserRole }[];
  likeCount: number;

  createdAt?: Date;
  updatedAt?: Date;
}
