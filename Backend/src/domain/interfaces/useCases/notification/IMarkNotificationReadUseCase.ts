export interface IMarkNotificationReadUseCase {
  markAsRead(notificationId: string): Promise<void>;
}
