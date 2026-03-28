import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetMessagesUseCase } from "@domain/interfaces/useCases/chat/IGetMessagesUseCase";
import { GetMessagesReqDTO, GetMessagesResDTO } from "application/dto/chat/sendMessageDTO";

export class GetMessagesUseCase implements IGetMessagesUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _storageService: IStorageService
  ) {}

  async execute(data: GetMessagesReqDTO): Promise<GetMessagesResDTO> {
    const { conversationId, page, limit } = data;

    const skip = (page - 1) * limit;

    const messages = await this._messageRepository.findByConversation(conversationId, skip, limit);

    const updatedMessages = await Promise.all(
      messages.map(async (msg) => {
        if (msg.fileUrl) {
          msg.fileUrl = await this._storageService.createSignedUrl(msg.fileUrl, 60 * 60);
        }
        return msg;
      })
    );

    const total = await this._messageRepository.countByConversation(conversationId);

    return {
      messages: updatedMessages,
      total,
    };
  }
}
