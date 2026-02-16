import {
  GetUserConversationsReqDTO,
  GetUserConversationsResDTO,
} from "application/dto/chat/getConversationDTO";

export interface IGetUserConversationsUseCase {
  execute(data: GetUserConversationsReqDTO): Promise<GetUserConversationsResDTO>;
}
