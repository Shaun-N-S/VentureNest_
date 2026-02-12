import {
  GetUnreadCountReqDTO,
  GetUnreadCountResDTO,
} from "application/dto/chat/MessageResponseDTO";

export interface IGetUnreadCountUseCase {
  execute(data: GetUnreadCountReqDTO): Promise<GetUnreadCountResDTO>;
}
