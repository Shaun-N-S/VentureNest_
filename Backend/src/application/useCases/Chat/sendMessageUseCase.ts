import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IConversationRepository } from "@domain/interfaces/repositories/IConversationRepository";
import { ISendMessageUseCase } from "@domain/interfaces/useCases/chat/ISendMessageUseCase";
import { MessageMapper } from "application/mappers/messageMapper";
import { SendMessageReqDTO, SendMessageResDTO } from "application/dto/chat/sendMessageDTO";
import { IChatEventPublisher } from "@domain/interfaces/services/IChatEventPublisher";
import { NotFoundExecption } from "application/constants/exceptions";
import { CHAT_ERRORS } from "@shared/constants/error";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { Message } from "@domain/entities/chat/messageEntity";

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _conversationRepository: IConversationRepository,
    private _chatEventPublisher: IChatEventPublisher,
    private _storageService: IStorageService
  ) {}

  async execute(data: SendMessageReqDTO): Promise<SendMessageResDTO> {
    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (data.file) {
      const key = `chat/${data.conversationId}/${Date.now()}-${data.file.name}`;

      fileUrl = await this._storageService.upload(data.file, key);
      fileName = data.file.name;
    }

    let signedUrl: string | undefined;

    if (fileUrl) {
      signedUrl = await this._storageService.createSignedUrl(fileUrl, 60 * 60);
    }

    const messageData = {
      conversationId: data.conversationId,
      senderId: data.senderId,
      senderRole: data.senderRole,
      ...(data.content && { content: data.content }),
      ...(fileUrl && { fileUrl }),
      ...(fileName && { fileName }),
      messageType: data.messageType,
    };

    const messageEntity = MessageMapper.fromSendDTO(messageData);

    const saved = await this._messageRepository.save(messageEntity);

    const previewText =
      data.messageType === "IMAGE"
        ? "📷 Image"
        : data.messageType === "FILE"
          ? "📎 File"
          : data.content || "";

    await this._conversationRepository.updateLastMessage(data.conversationId, {
      senderId: data.senderId,
      text: previewText,
      sentAt: new Date(),
    });

    const conversation = await this._conversationRepository.findById(data.conversationId);

    if (!conversation) {
      throw new NotFoundExecption(CHAT_ERRORS.CONVERSATION_NOT_FOUND);
    }

    const participantIds = conversation.participants.map((p) => p.userId);

    const messageForSocket: Message = {
      ...saved,
      ...(signedUrl && { fileUrl: signedUrl }),
    };

    await this._chatEventPublisher.publishNewMessage(messageForSocket, participantIds);

    await this._chatEventPublisher.publishConversationUpdated({
      conversationId: data.conversationId,
      senderId: data.senderId,
      text: previewText,
      sentAt: new Date(),
    });

    return { messageId: saved._id! };
  }
}
