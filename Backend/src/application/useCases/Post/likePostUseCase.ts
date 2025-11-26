import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { ILikePostUseCase } from "@domain/interfaces/useCases/post/ILikePostUseCase";
import { UserRole } from "@domain/enum/userRole";

export class LikePostUseCase implements ILikePostUseCase {
  constructor(private postRepo: IPostRepository) {}

  async execute(postId: string, likerId: string, likerRole: UserRole) {
    const post = await this.postRepo.findById(postId);
    if (!post) throw new Error("Post not found");

    const alreadyLiked = post.likes.some((l) => l.likerId === likerId);

    if (alreadyLiked) {
      await this.postRepo.removeLike(postId, likerId);
    } else {
      await this.postRepo.addLike(postId, likerId, likerRole);
    }

    const updated = await this.postRepo.findById(postId);

    return {
      liked: !alreadyLiked,
      likeCount: updated!.likeCount,
    };
  }
}
