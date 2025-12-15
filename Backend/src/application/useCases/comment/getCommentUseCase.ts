import { ICommentRepository } from "@domain/interfaces/repositories/ICommentRepository";
import { IGetCommentsUseCase } from "@domain/interfaces/useCases/comment/IGetCommentUseCase";
import { CommentMapper } from "application/mappers/commentMapper";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { CommentFeedDTO } from "application/dto/comment/commentDTO";

export class GetCommentsUseCase implements IGetCommentsUseCase {
  constructor(
    private _commentRepository: ICommentRepository,
    private _storageService: IStorageService
  ) {}

  async execute(
    postId: string,
    limit: number,
    page: number,
    currentUserId: string
  ): Promise<{
    comments: CommentFeedDTO[];
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  }> {
    const skip = (page - 1) * limit;

    const { comments, total } = await this._commentRepository.findCommentsByPost(
      postId,
      skip,
      limit
    );

    let formattedComments = comments.map((c) => CommentMapper.toFeedDTO(c, currentUserId));

    formattedComments = await Promise.all(
      formattedComments.map(async (comment) => {
        if (comment.userProfileImg) {
          comment.userProfileImg = await this._storageService.createSignedUrl(
            comment.userProfileImg,
            10 * 60
          );
        }
        return comment;
      })
    );

    return {
      comments: formattedComments,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + comments.length < total,
    };
  }
}
