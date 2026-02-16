import { UserRole } from "@domain/enum/userRole";
import { NotificationType } from "@domain/enum/notificationType";

export interface GetNotificationsReqDTO {
  userId: string;
  skip: number;
  limit: number;
}

export interface NotificationResponseDTO {
  _id: string;

  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;

  sender: {
    id: string;
    userName: string;
    role: UserRole;
    profileImg?: string;
  };
}
