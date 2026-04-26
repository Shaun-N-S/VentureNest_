import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IChatEventPublisher } from "@domain/interfaces/services/IChatEventPublisher";
import { IDeleteMessageUseCase } from "@domain/interfaces/useCases/chat/IDeleteMessageUseCase";
import { CHAT_ERRORS } from "@shared/constants/error";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _publisher: IChatEventPublisher
  ) {}

  async execute({ messageId, userId }: { messageId: string; userId: string }): Promise<void> {
    const message = await this._messageRepository.findById(messageId);

    if (!message) throw new NotFoundExecption(CHAT_ERRORS.MESSAGE_NOT_FOUND);

    if (message.senderId !== userId) {
      throw new InvalidDataException(CHAT_ERRORS.UNAUTHORIZED);
    }

    await this._messageRepository.deleteMessage(messageId, userId);

    await this._publisher.publishMessageDeleted({
      messageId,
      conversationId: message.conversationId,
    });
  }
}
