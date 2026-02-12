import mongoose from "mongoose";
import { UserRole } from "@domain/enum/userRole";

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "participants.model",
    },
    model: {
      type: String,
      required: true,
      enum: ["User", "Investor"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
  },
  { _id: false }
);

const lastMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "lastMessage.senderModel",
    },
    senderModel: {
      type: String,
      enum: ["User", "Investor"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [participantSchema],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length === 2,
        message: "Conversation must have exactly 2 participants",
      },
    },

    lastMessage: lastMessageSchema,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ "participants.userId": 1 });

export default conversationSchema;
