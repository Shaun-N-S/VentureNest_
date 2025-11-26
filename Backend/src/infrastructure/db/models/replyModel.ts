import { Document, model, Types } from "mongoose";
import replySchema from "../schema/replySchema";
import { UserRole } from "@domain/enum/userRole";

export interface IReplyModel extends Document {
  _id: string;

  commentId: Types.ObjectId;
  replierId: Types.ObjectId;
  replierRole: UserRole;

  replyText: string;

  likes: { likerId: Types.ObjectId; likerRole: UserRole }[];
  likeCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export const replyModel = model<IReplyModel>("Reply", replySchema);
