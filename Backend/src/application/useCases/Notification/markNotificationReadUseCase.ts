import { IMarkNotificationReadUseCase } from "@domain/interfaces/useCases/notification/IMarkNotificationReadUseCase";
import { INotificationRepository } from "@domain/interfaces/repositories/INotificationRepository";

export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase {
  constructor(private _notificationRepo: INotificationRepository) {}

  async markAsRead(notificationId: string): Promise<void> {
    await this._notificationRepo.markAsRead(notificationId);
  }
}
