import mongoose from "mongoose";
import { MessageType } from "@domain/enum/messageType";
import { MessageStatus } from "@domain/enum/messageStatus";
import { UserRole } from "@domain/enum/userRole";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    messageType: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
    },

    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.SENT,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

export default messageSchema;
