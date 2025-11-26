import type { UserRole } from "./UserRole";

export interface ReplyFeedDTO {
  _id: string;
  commentId: string;
  replierId: string;
  replierRole: UserRole;
  replierName: string;
  replierProfileImg?: string;
  replyText: string;
  likes: number;
  createdAt: string | Date;
}
