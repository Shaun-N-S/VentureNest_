import {
  GetNotificationsReqDTO,
  NotificationResponseDTO,
} from "application/dto/notification/notificationResponseDTO";

export interface IGetNotificationsUseCase {
  getNotifications(data: GetNotificationsReqDTO): Promise<NotificationResponseDTO[]>;
}
