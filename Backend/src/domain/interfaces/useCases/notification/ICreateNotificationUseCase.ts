import { CreateNotificationDTO } from "application/dto/notification/createNotificationDTO";
import { NotificationResponseDTO } from "application/dto/notification/notificationResponseDTO";

export interface ICreateNotificationUseCase {
  createNotification(data: CreateNotificationDTO): Promise<NotificationResponseDTO>;
}
