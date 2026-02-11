import { Document, model } from "mongoose";
import notificationSchema from "../schema/notificationSchema";
import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";

export interface INotificationModel extends Document {
  _id: string;

  recipientId: string;
  recipientRole: UserRole;

  actorId: string;
  actorRole: UserRole;

  type: NotificationType;

  entityId: string;
  entityType: NotificationEntityType;

  message: string;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const notificationModel = model<INotificationModel>("Notification", notificationSchema);
