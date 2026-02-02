import type { PersonalPost } from "../pages/Investor/Profile/InvestorProfile/ProfilePage";
import type { UserRole } from "./UserRole";

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
  data: { posts: AllPost[]; totalPosts: number; hasNextPage: boolean };
}

export interface AllPost {
  _id: string;
  authorId: string;
  authorRole: UserRole;
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

export interface PostsPage {
  posts: AllPost[];
  totalPosts: number;
  hasNextPage: boolean;
}

export interface PersonalPostPage {
  data: {
    data: {
      posts: PersonalPost[];
      totalPosts: number;
      hasNextPage: boolean;
    };
  };
}
