import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { ILikePostUseCase } from "@domain/interfaces/useCases/post/ILikePostUseCase";
import { UserRole } from "@domain/enum/userRole";
import { IEngagementEventPublisher } from "@domain/interfaces/services/IEngagementEventPublisher";
import { ICreateNotificationUseCase } from "@domain/interfaces/useCases/notification/ICreateNotificationUseCase";
import { NotificationType } from "@domain/enum/notificationType";
import { NotificationEntityType } from "@domain/enum/notificationEntityType";
import { NotFoundExecption } from "application/constants/exceptions";
import { POST_ERRORS } from "@shared/constants/error";

export class LikePostUseCase implements ILikePostUseCase {
  constructor(
    private _postRepo: IPostRepository,
    private _engagementPublisher: IEngagementEventPublisher,
    private _notificationUseCase: ICreateNotificationUseCase
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
    const post = await this._postRepo.findById(postId);
    if (!post) throw new NotFoundExecption(POST_ERRORS.NO_POST_FOUND);

    const alreadyLiked = post.likes.some((l) => l.likerId === likerId);

    if (alreadyLiked) {
      await this._postRepo.removeLike(postId, likerId);
    } else {
      await this._postRepo.addLike(postId, likerId, likerRole);

      if (post.authorId !== likerId) {
        await this._notificationUseCase.createNotification({
          recipientId: post.authorId,
          recipientRole: post.authorRole,
          actorId: likerId,
          actorRole: likerRole,
          type: NotificationType.POST_LIKED,
          entityId: postId,
          entityType: NotificationEntityType.POST,
          message: "liked your post",
        });
      }
    }

    const updated = await this._postRepo.findById(postId);

    await this._engagementPublisher.publishPostLikeUpdated({
      postId,
      likeCount: updated!.likeCount,
      actorId: likerId,
      liked: !alreadyLiked,
    });

    return {
      postId,
      liked: !alreadyLiked,
      likeCount: updated!.likeCount,
    };
  }
}
