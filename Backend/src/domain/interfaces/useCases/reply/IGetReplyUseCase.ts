import { ReplyFeedDTO } from "application/dto/reply/replyDTO";

export interface IGetReplyUseCase {
  execute(
    commentId: string,
    limit: number,
    page: number
  ): Promise<{
    replies: ReplyFeedDTO[];
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  }>;
}
