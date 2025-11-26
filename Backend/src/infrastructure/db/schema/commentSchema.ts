import { Schema, Types } from "mongoose";
import { UserRole } from "@domain/enum/userRole";

const commentSchema = new Schema(
  {
    postId: { type: Types.ObjectId, required: true, ref: "Post" },

    userId: { type: Types.ObjectId, required: true },

    userRole: {
      type: String,
      enum: [UserRole.USER, UserRole.INVESTOR],
      required: true,
    },

    commentText: { type: String, required: true, trim: true },

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
    repliesCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Populate role-based user
commentSchema.virtual("user", {
  ref: function (doc: any) {
    return doc.userRole === UserRole.INVESTOR ? "Investor" : "User";
  },
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Enable virtuals
commentSchema.set("toJSON", { virtuals: true });
commentSchema.set("toObject", { virtuals: true });

export default commentSchema;
