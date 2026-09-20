import {
  GetNotificationsReqDTO,
  NotificationResponseDTO,
} from "application/dto/notification/notificationResponseDTO";

export interface GetNotificationsResultDTO {
  notifications: NotificationResponseDTO[];
  hasNextPage: boolean;
}

export interface IGetNotificationsUseCase {
  getNotifications(data: GetNotificationsReqDTO): Promise<GetNotificationsResultDTO>;
}
