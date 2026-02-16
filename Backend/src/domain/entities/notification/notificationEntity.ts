import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";
export interface PopulatedActor {
  id: string;
  userName: string;
  profileImg?: string;
}

export interface NotificationEntity {
  _id?: string;

  recipientId: string;
  recipientRole: UserRole;

  actorId: string;
  actorRole: UserRole;
  actorModel: "User" | "Investor";

  type: NotificationType;

  entityId: string;
  entityType: NotificationEntityType;

  message: string;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;

  actor?: PopulatedActor;
}
