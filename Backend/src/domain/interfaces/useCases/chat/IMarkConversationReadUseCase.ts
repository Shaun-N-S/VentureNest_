import {
  MarkConversationReadReqDTO,
  MarkConversationReadResDTO,
} from "application/dto/chat/MessageResponseDTO";

export interface IMarkConversationReadUseCase {
  execute(data: MarkConversationReadReqDTO): Promise<MarkConversationReadResDTO>;
}
