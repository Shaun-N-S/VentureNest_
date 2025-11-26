import { CommentFeedDTO, CreateCommentDTO } from "application/dto/comment/commentDTO";

export interface ICreateCommentUseCase {
  addComment(data: CreateCommentDTO): Promise<CommentFeedDTO>;
}
