export interface ICompleteSessionUseCase {
  execute(sessionId: string, userId: string): Promise<void>;
}
