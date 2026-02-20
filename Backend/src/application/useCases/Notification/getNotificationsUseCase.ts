import { IGetNotificationsUseCase } from "@domain/interfaces/useCases/notification/IGetNotificationsUseCase";
import { INotificationRepository } from "@domain/interfaces/repositories/INotificationRepository";
import {
  GetNotificationsReqDTO,
  NotificationResponseDTO,
} from "application/dto/notification/notificationResponseDTO";
import { NotificationMapper } from "application/mappers/notificationMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CONFIG } from "@config/config";

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(
    private _notificationRepo: INotificationRepository,
    private _storageService: IStorageService
  ) {}

  async getNotifications(data: GetNotificationsReqDTO): Promise<NotificationResponseDTO[]> {
    const notifications = await this._notificationRepo.findByRecipient(
      data.userId,
      data.skip,
      data.limit
    );

    const result: NotificationResponseDTO[] = [];

    for (const notification of notifications) {
      if (notification.actor?.profileImg) {
        const signedUrl = await this._storageService.createSignedUrl(
          notification.actor.profileImg,
          CONFIG.SIGNED_URL_EXPIRY
        );

        notification.actor.profileImg = signedUrl;
      }

      const dto = NotificationMapper.toResponseDTO(notification);

      result.push(dto);
    }

    return result;
  }
}
