import { SendMessageReqDTO, SendMessageResDTO } from "application/dto/chat/sendMessageDTO";

export interface ISendMessageUseCase {
  execute(data: SendMessageReqDTO): Promise<SendMessageResDTO>;
}
