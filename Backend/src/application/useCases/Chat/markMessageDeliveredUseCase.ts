import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IChatEventPublisher } from "@domain/interfaces/services/IChatEventPublisher";
import { IMarkMessageDeliveredUseCase } from "@domain/interfaces/useCases/chat/IMarkMessageDeliveredUseCase";

export class MarkMessageDeliveredUseCase implements IMarkMessageDeliveredUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _publisher: IChatEventPublisher
  ) {}

  async execute({ conversationId, userId }: { conversationId: string; userId: string }) {
    await this._messageRepository.markAsDelivered(conversationId, userId);

    await this._publisher.publishMessageDelivered({
      conversationId,
      userId,
    });
  }
}
