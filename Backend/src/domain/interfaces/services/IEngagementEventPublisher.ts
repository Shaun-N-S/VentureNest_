export interface IEngagementEventPublisher {
  publishPostLikeUpdated(data: {
    postId: string;
    likeCount: number;
    actorId: string;
  }): Promise<void>;

  publishPostCommentUpdated(data: { postId: string; commentCount: number }): Promise<void>;
}
