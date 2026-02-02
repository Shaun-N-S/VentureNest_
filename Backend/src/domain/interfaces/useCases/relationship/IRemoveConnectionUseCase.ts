export interface IRemoveConnectionUseCase {
  execute(currentUserId: string, targetUserId: string): Promise<boolean>;
}
