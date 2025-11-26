import { IReplyRepository } from "@domain/interfaces/repositories/IReplyRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetReplyUseCase } from "@domain/interfaces/useCases/reply/IGetReplyUseCase";
import { ReplyFeedDTO } from "application/dto/reply/replyDTO";
import { ReplyMapper } from "application/mappers/replyMapper";

export class GetReplyUseCase implements IGetReplyUseCase {
  constructor(
    private _replyRepository: IReplyRepository,
    private _storageService: IStorageService
  ) {}

  async execute(
    commentId: string,
    limit: number,
    page: number
  ): Promise<{
    replies: ReplyFeedDTO[];
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  }> {
    const skip = (page - 1) * limit;

    const { replies, total } = await this._replyRepository.findRepliesByComment(
      commentId,
      skip,
      limit
    );

    let formattedReplies = replies.map(ReplyMapper.toFeedDTO);

    formattedReplies = await Promise.all(
      formattedReplies.map(async (reply) => {
        if (reply.replierProfileImg) {
          reply.replierProfileImg = await this._storageService.createSignedUrl(
            reply.replierProfileImg,
            600
          );
        }
        return reply;
      })
    );

    return {
      replies: formattedReplies,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + replies.length < total,
    };
  }
}
