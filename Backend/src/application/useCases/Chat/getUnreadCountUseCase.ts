import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IGetUnreadCountUseCase } from "@domain/interfaces/useCases/chat/IGetUnreadCountUseCase";
import {
  GetUnreadCountReqDTO,
  GetUnreadCountResDTO,
} from "application/dto/chat/MessageResponseDTO";

export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {
  constructor(private _messageRepository: IMessageRepository) {}

  async execute(data: GetUnreadCountReqDTO): Promise<GetUnreadCountResDTO> {
    const count = await this._messageRepository.countUnreadByUser(data.userId);

    return {
      unreadCount: count,
    };
  }
}
