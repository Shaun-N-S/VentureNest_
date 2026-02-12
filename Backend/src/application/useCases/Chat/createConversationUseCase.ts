import { IConversationRepository } from "@domain/interfaces/repositories/IConversationRepository";
import { ICreateConversationUseCase } from "@domain/interfaces/useCases/chat/ICreateConversationUseCase";
import {
  CreateConversationReqDTO,
  CreateConversationResDTO,
} from "application/dto/chat/createConversationDTO";
import { ConversationMapper } from "application/mappers/conversationMapper";

export class CreateConversationUseCase implements ICreateConversationUseCase {
  constructor(private readonly _conversationRepository: IConversationRepository) {}

  async execute(data: CreateConversationReqDTO): Promise<CreateConversationResDTO> {
    const existing = await this._conversationRepository.findBetweenUsers(
      data.currentUserId,
      data.targetUserId
    );

    if (existing) {
      return { conversationId: existing._id! };
    }

    const conversationEntity = ConversationMapper.fromCreateDTO(data);

    const saved = await this._conversationRepository.save(conversationEntity);

    return { conversationId: saved._id! };
  }
}
