import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IMarkConversationReadUseCase } from "@domain/interfaces/useCases/chat/IMarkConversationReadUseCase";
import {
  MarkConversationReadReqDTO,
  MarkConversationReadResDTO,
} from "application/dto/chat/MessageResponseDTO";

export class MarkConversationReadUseCase implements IMarkConversationReadUseCase {
  constructor(private _messageRepository: IMessageRepository) {}

  async execute(data: MarkConversationReadReqDTO): Promise<MarkConversationReadResDTO> {
    await this._messageRepository.markMessagesAsRead(data.conversationId, data.userId);

    return { success: true };
  }
}
