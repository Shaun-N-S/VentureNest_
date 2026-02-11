export interface IGetUnreadNotificationCountUseCase {
  execute(userId: string): Promise<number>;
}
