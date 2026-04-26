export interface IMarkMessageDeliveredUseCase {
  execute(data: { conversationId: string; userId: string }): Promise<void>;
}
