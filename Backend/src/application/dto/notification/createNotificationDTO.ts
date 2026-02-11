import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";

export interface CreateNotificationDTO {
  recipientId: string;
  recipientRole: UserRole;

  actorId: string;
  actorRole: UserRole;

  type: NotificationType;

  entityId: string;
  entityType: NotificationEntityType;

  message: string;
}
