import { CreateReplyDTO, ReplyFeedDTO } from "application/dto/reply/replyDTO";

export interface ICreateReplyUseCase {
  addReply(data: CreateReplyDTO): Promise<ReplyFeedDTO>;
}
