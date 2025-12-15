export interface CommentApiResponse {
  _id: string;
  userName: string;
  userProfileImg?: string;
  commentText: string;
  likes: number;
  liked: boolean;
  repliesCount: number;
  createdAt: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: {
    comments: CommentApiResponse[];
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}
