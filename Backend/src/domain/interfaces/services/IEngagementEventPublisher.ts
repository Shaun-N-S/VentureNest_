export interface IEngagementEventPublisher {
  // Publish when a post is liked or unliked.
  publishPostLikeToggled(event: {
    postId: string;
    likerId: string;
    liked: boolean;
    likeCount: number;
  }): Promise<void>;
}
