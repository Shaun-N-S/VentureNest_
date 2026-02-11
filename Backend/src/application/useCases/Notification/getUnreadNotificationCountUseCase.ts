import { INotificationRepository } from "@domain/interfaces/repositories/INotificationRepository";
import { IGetUnreadNotificationCountUseCase } from "@domain/interfaces/useCases/notification/IGetUnreadNotificationCountUseCase";

export class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationCountUseCase {
  constructor(private _notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<number> {
    return this._notificationRepo.countUnread(userId);
  }
}
