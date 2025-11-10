import { Document, model, Types } from "mongoose";
import { UserRole } from "@domain/enum/userRole";
import postSchema from "../schema/postSchema";

export interface IPostModel extends Document {
  _id: string;
  authorId: Types.ObjectId;
  authorRole: UserRole;
  content: string;
  mediaUrls: string[];
  likes: {
    likerId: Types.ObjectId;
    likerRole: UserRole;
  }[];
  likeCount: number;
  commentsCount: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const postModel = model<IPostModel>("Post", postSchema);
