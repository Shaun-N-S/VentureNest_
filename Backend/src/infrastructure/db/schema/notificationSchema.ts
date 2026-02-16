import mongoose from "mongoose";
import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "actorModel",
    },

    actorModel: {
      type: String,
      enum: ["User", "Investor"],
      required: true,
    },

    actorRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: Object.values(NotificationEntityType),
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });

export default notificationSchema;
