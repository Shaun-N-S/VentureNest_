import type { NotifyEventType } from "@tanstack/react-query";
import type { UserRole } from "./UserRole";

export interface Notification {
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

  createdAt: string;

  sender?: {
    id: string;
    userName: string;
    profileImg?: string;
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export type NotificationType =
  | "POST_LIKED"
  | "POST_COMMENTED"
  | "FOLLOWED"
  | "INVESTMENT_RECEIVED"
  | "CONNECTION_REQUEST"
  | string;

export type NotificationEntityType =
  | "POST"
  | "COMMENT"
  | "PROJECT"
  | "INVESTMENT_OFFER";

export interface AppNotification {
  _id: string;
  type: NotifyEventType;
  message: string;
  isRead: boolean;
  createdAt: string;

  sender?: {
    id: string;
    userName: string;
    profileImg?: string;
  };
}
