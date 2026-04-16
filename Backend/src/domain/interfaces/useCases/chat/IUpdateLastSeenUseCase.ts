export interface IUpdateLastSeenUseCase {
  execute(userId: string, role: string): Promise<void>;
}
