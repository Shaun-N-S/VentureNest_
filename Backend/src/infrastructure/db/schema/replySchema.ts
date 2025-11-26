import { Schema, Types } from "mongoose";
import { UserRole } from "@domain/enum/userRole";

const replySchema = new Schema(
  {
    commentId: { type: Types.ObjectId, required: true, ref: "Comment" },

    replierId: { type: Types.ObjectId, required: true },

    replierRole: {
      type: String,
      enum: [UserRole.USER, UserRole.INVESTOR],
      required: true,
    },

    replyText: { type: String, required: true, trim: true },

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
  },
  { timestamps: true }
);

// Populate user based on role
replySchema.virtual("user", {
  ref: function (doc: any) {
    return doc.replierRole === UserRole.INVESTOR ? "Investor" : "User";
  },
  localField: "replierId",
  foreignField: "_id",
  justOne: true,
});

replySchema.set("toJSON", { virtuals: true });
replySchema.set("toObject", { virtuals: true });

export default replySchema;
