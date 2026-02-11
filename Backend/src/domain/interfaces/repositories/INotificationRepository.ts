import { NotificationEntity } from "@domain/entities/notification/notificationEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface INotificationRepository extends IBaseRepository<NotificationEntity> {
  findByRecipient(recipientId: string, skip: number, limit: number): Promise<NotificationEntity[]>;

  countUnread(recipientId: string): Promise<number>;

  markAsRead(notificationId: string): Promise<void>;

  markAllAsRead(recipientId: string): Promise<void>;
}
