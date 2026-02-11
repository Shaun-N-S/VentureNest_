export interface IMarkAllNotificationsReadUseCase {
  markAll(userId: string): Promise<void>;
}
