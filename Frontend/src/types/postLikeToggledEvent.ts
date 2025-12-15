export interface PostLikeToggledEvent {
  postId: string;
  likerId: string;
  liked: boolean;
  likeCount: number;
}

