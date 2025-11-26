import { CommentFeedDTO } from "application/dto/comment/commentDTO";

export interface IGetCommentsUseCase {
  execute(
    postId: string,
    limit: number,
    page: number
  ): Promise<{
    comments: CommentFeedDTO[];
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  }>;
}
