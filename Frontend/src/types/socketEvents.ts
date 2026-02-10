export interface PostLikeUpdatedEvent {
  postId: string;
  likeCount: number;
}

export interface PostCommentUpdatedEvent {
  postId: string;
  commentCount: number;
}
