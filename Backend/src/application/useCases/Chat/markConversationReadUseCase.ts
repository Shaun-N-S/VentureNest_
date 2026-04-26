import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IChatEventPublisher } from "@domain/interfaces/services/IChatEventPublisher";
import { IMarkConversationReadUseCase } from "@domain/interfaces/useCases/chat/IMarkConversationReadUseCase";
import {
  MarkConversationReadReqDTO,
  MarkConversationReadResDTO,
} from "application/dto/chat/MessageResponseDTO";

export class MarkConversationReadUseCase implements IMarkConversationReadUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _publisher: IChatEventPublisher
  ) {}

  async execute(data: MarkConversationReadReqDTO): Promise<MarkConversationReadResDTO> {
    await this._messageRepository.markMessagesAsRead(data.conversationId, data.userId);

    await this._publisher.publishMessageRead({
      conversationId: data.conversationId,
      userId: data.userId,
    });
    return { success: true };
  }
}
