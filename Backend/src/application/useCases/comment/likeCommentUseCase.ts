import { ICommentRepository } from "@domain/interfaces/repositories/ICommentRepository";
import { UserRole } from "@domain/enum/userRole";
import { ILikeCommentUseCase } from "@domain/interfaces/useCases/comment/ILikeCommentUseCase";
import { NotFoundExecption } from "application/constants/exceptions";
import { COMMENT_ERRORS } from "@shared/constants/error";

export class LikeCommentUseCase implements ILikeCommentUseCase {
  constructor(private _commentRepo: ICommentRepository) {}

  async execute(commentId: string, likerId: string, likerRole: UserRole) {
    const comment = await this._commentRepo.findById(commentId);
    if (!comment) throw new NotFoundExecption(COMMENT_ERRORS.NO_COMMENT_FOUND);

    const alreadyLiked = comment.likes.some((l) => l.likerId === likerId);

    if (alreadyLiked) {
      await this._commentRepo.removeLike(commentId, likerId);
    } else {
      await this._commentRepo.addLike(commentId, likerId, likerRole);
    }

    const updated = await this._commentRepo.findById(commentId);

    return {
      liked: !alreadyLiked,
      likeCount: updated!.likeCount,
    };
  }
}
