import {
  CreateConversationReqDTO,
  CreateConversationResDTO,
} from "application/dto/chat/createConversationDTO";

export interface ICreateConversationUseCase {
  execute(data: CreateConversationReqDTO): Promise<CreateConversationResDTO>;
}
