import { Document, model, Types } from "mongoose";
import { UserRole } from "@domain/enum/userRole";
import commentSchema from "../schema/commentSchema";

export interface ICommentModel extends Document {
  _id: string;

  postId: Types.ObjectId;
  userId: Types.ObjectId;
  userRole: UserRole;

  commentText: string;

  likes: {
    likerId: Types.ObjectId;
    likerRole: UserRole;
  }[];
  likeCount: number;
  repliesCount: number;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const commentModel = model<ICommentModel>("Comment", commentSchema);
