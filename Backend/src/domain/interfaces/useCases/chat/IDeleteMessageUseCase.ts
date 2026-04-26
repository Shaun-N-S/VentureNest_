export interface IDeleteMessageUseCase {
  execute(data: { messageId: string; userId: string }): Promise<void>;
}
