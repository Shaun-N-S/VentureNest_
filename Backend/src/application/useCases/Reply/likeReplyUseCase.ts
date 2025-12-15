import { UserRole } from "@domain/enum/userRole";
import { IReplyRepository } from "@domain/interfaces/repositories/IReplyRepository";
import { ILikeReplyUseCase } from "@domain/interfaces/useCases/reply/ILikeReplyUseCase";
import { REPLY_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";

export class LikeReplyUseCase implements ILikeReplyUseCase {
  constructor(private _replyRepo: IReplyRepository) {}

  async execute(
    replyId: string,
    likerId: string,
    likerRole: UserRole
  ): Promise<{ liked: boolean; likeCount: number }> {
    const reply = await this._replyRepo.findById(replyId);

    if (!reply) throw new NotFoundExecption(REPLY_ERRORS.NO_REPLY_FOUND);

    const alreadyLiked = reply.likes.some((l) => l.likerId === likerId);

    if (alreadyLiked) {
      await this._replyRepo.removeLike(replyId, likerId);
    } else {
      await this._replyRepo.addLike(replyId, likerId, likerRole);
    }

    const updated = await this._replyRepo.findById(replyId);

    return {
      liked: !alreadyLiked,
      likeCount: updated!.likeCount,
    };
  }
}
