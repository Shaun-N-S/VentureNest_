import { UserRole } from "@domain/enum/userRole";

export interface ReplyFeedDTO {
  _id: string;
  commentId: string;
  replierId: string;
  replierRole: UserRole;
  replierName: string;
  replierProfileImg?: string;
  replyText: string;
  likes: number;
  createdAt: Date;
}

export interface ReplyResDTO {
  _id: string;
  commentId: string;
  replierId: string;
  replierRole: UserRole;

  replyText: string;

  likes: { likerId: string; likerRole: UserRole }[];
  likeCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReplyDTO {
  commentId: string;
  replierId: string;
  replierRole: UserRole;
  replyText: string;
}

export interface GetRepliesQuery {
  commentId: string;
}
