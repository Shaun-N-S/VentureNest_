import { IMarkAllNotificationsReadUseCase } from "@domain/interfaces/useCases/notification/IMarkAllNotificationsReadUseCase";
import { INotificationRepository } from "@domain/interfaces/repositories/INotificationRepository";

export class MarkAllNotificationsReadUseCase implements IMarkAllNotificationsReadUseCase {
  constructor(private _notificationRepo: INotificationRepository) {}

  async markAll(userId: string): Promise<void> {
    await this._notificationRepo.markAllAsRead(userId);
  }
}
