import { GetMessagesReqDTO, GetMessagesResDTO } from "application/dto/chat/sendMessageDTO";

export interface IGetMessagesUseCase {
  execute(data: GetMessagesReqDTO): Promise<GetMessagesResDTO>;
}
