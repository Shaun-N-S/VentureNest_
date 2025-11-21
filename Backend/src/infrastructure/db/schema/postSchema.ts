import { Schema, Types } from "mongoose";
import { UserRole } from "@domain/enum/userRole";
import { IPostModel } from "../models/postModel";

const postSchema = new Schema(
  {
    authorId: { type: Types.ObjectId, required: true },
    authorRole: {
      type: String,
      enum: [UserRole.USER, UserRole.INVESTOR],
      required: true,
    },
    content: { type: String, trim: true },
    mediaUrls: [String],
    likes: [
      {
        likerId: { type: Types.ObjectId, required: true },
        likerRole: {
          type: String,
          enum: [UserRole.USER, UserRole.INVESTOR],
          required: true,
        },
      },
    ],
    likeCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    commentsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

postSchema.virtual("author", {
  ref: (doc: IPostModel) => (doc.authorRole === UserRole.USER ? "User" : "Investor"),
  localField: "authorId",
  foreignField: "_id",
  justOne: true,
});

export default postSchema;
