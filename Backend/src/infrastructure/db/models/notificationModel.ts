import mongoose, { Document, model } from "mongoose";
import notificationSchema from "../schema/notificationSchema";
import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";

export interface INotificationModel extends Document {
  _id: mongoose.Types.ObjectId;

  recipientId: mongoose.Types.ObjectId;
  recipientRole: UserRole;

  actorId:
    | mongoose.Types.ObjectId
    | {
        _id: mongoose.Types.ObjectId;
        userName?: string;
        companyName?: string;
        profileImg?: string;
      };

  actorModel: "User" | "Investor";
  actorRole: UserRole;

  type: NotificationType;

  entityId: mongoose.Types.ObjectId;
  entityType: NotificationEntityType;

  message: string;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const notificationModel = model<INotificationModel>("Notification", notificationSchema);
