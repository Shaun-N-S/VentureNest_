import { IGetNotificationsUseCase } from "@domain/interfaces/useCases/notification/IGetNotificationsUseCase";
import { INotificationRepository } from "@domain/interfaces/repositories/INotificationRepository";
import {
  GetNotificationsReqDTO,
  NotificationResponseDTO,
} from "application/dto/notification/notificationResponseDTO";
import { NotificationMapper } from "application/mappers/notificationMapper";

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(private _notificationRepo: INotificationRepository) {}

  async getNotifications(data: GetNotificationsReqDTO): Promise<NotificationResponseDTO[]> {
    const notifications = await this._notificationRepo.findByRecipient(
      data.userId,
      data.skip,
      data.limit
    );

    return notifications.map(NotificationMapper.toResponseDTO);
  }
}
