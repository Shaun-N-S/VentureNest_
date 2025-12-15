import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { ILikePostUseCase } from "@domain/interfaces/useCases/post/ILikePostUseCase";
import { UserRole } from "@domain/enum/userRole";
import { IEngagementEventPublisher } from "@domain/interfaces/services/IEngagementEventPublisher";

export class LikePostUseCase implements ILikePostUseCase {
  constructor(
    private postRepo: IPostRepository,
    private engagementPublisher: IEngagementEventPublisher
  ) {}

  async execute(
    postId: string,
    likerId: string,
    likerRole: UserRole
  ): Promise<{
    liked: boolean;
    likeCount: number;
    postId: string;
  }> {
    const post = await this.postRepo.findById(postId);
    if (!post) throw new Error("Post not found");

    const alreadyLiked = post.likes.some((l) => l.likerId === likerId);

    if (alreadyLiked) {
      await this.postRepo.removeLike(postId, likerId);
    } else {
      await this.postRepo.addLike(postId, likerId, likerRole);
    }

    const updated = await this.postRepo.findById(postId);

    const result = {
      postId,
      likerId,
      liked: !alreadyLiked,
      likeCount: updated?.likeCount!,
    };
    await this.engagementPublisher.publishPostLikeToggled(result);

    return {
      postId,
      liked: !alreadyLiked,
      likeCount: updated!.likeCount,
    };
  }
}
