export interface CommentApiResponse {
  _id: string;
  userName: string;
  userProfileImg?: string;
  commentText: string;
  likes: number;
  repliesCount: number;
  createdAt: string;
}
