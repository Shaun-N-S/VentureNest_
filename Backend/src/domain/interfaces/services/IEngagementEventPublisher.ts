export interface IEngagementEventPublisher {
  publishPostLikeToggled(event: {
    postId: string;
    likerId: string;
    liked: boolean;
    likeCount: number;
  }): Promise<void>;
}
