
export interface FeedPost {
  _id: string;
  authorId: string;
  authorName: string;
  authorProfileImg: string;
  content: string;
  mediaUrls: string[];
  likeCount: number;
  commentsCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchPostsResponse {
  posts: AllPost[];
  totalPosts: number;
  hasNextPage: boolean;
}

export interface AllPost {
  _id: string;
  authorId: string;
  content: string;
  mediaUrls: string[];
  likeCount: number;
  commentsCount: number;
  authorName: string;
  authorProfileImg: string;
  createdAt: string;
  updatedAt: string;
  liked?: boolean;
}
