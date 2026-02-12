import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IConversationRepository } from "@domain/interfaces/repositories/IConversationRepository";
import { ISendMessageUseCase } from "@domain/interfaces/useCases/chat/ISendMessageUseCase";
import { MessageMapper } from "application/mappers/messageMapper";
import { SendMessageReqDTO, SendMessageResDTO } from "application/dto/chat/sendMessageDTO";
import { IChatEventPublisher } from "@domain/interfaces/services/IChatEventPublisher";
import { NotFoundExecption } from "application/constants/exceptions";
import { CHAT_ERRORS } from "@shared/constants/error";

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _conversationRepository: IConversationRepository,
    private _chatEventPublisher: IChatEventPublisher
  ) {}

  async execute(data: SendMessageReqDTO): Promise<SendMessageResDTO> {
    const messageEntity = MessageMapper.fromSendDTO(data);

    const saved = await this._messageRepository.save(messageEntity);

    await this._conversationRepository.updateLastMessage(data.conversationId, {
      senderId: data.senderId,
      text: data.content,
      sentAt: new Date(),
    });

    const conversation = await this._conversationRepository.findById(data.conversationId);

    if (!conversation) {
      throw new NotFoundExecption(CHAT_ERRORS.CONVERSATION_NOT_FOUND);
    }

    const participantIds = conversation.participants.map((p) => p.userId);

    await this._chatEventPublisher.publishNewMessage(saved, participantIds);

    await this._chatEventPublisher.publishConversationUpdated({
      conversationId: data.conversationId,
      senderId: data.senderId,
      text: data.content,
      sentAt: new Date(),
    });

    return { messageId: saved._id! };
  }
}
