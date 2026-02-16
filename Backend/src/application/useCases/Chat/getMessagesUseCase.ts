import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IGetMessagesUseCase } from "@domain/interfaces/useCases/chat/IGetMessagesUseCase";
import { GetMessagesReqDTO, GetMessagesResDTO } from "application/dto/chat/sendMessageDTO";

export class GetMessagesUseCase implements IGetMessagesUseCase {
  constructor(private _messageRepository: IMessageRepository) {}

  async execute(data: GetMessagesReqDTO): Promise<GetMessagesResDTO> {
    const { conversationId, page, limit } = data;

    const skip = (page - 1) * limit;

    const messages = await this._messageRepository.findByConversation(conversationId, skip, limit);

    const total = await this._messageRepository.countByConversation(conversationId);

    return {
      messages,
      total,
    };
  }
}
