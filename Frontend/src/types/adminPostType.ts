export interface AdminPost {
  _id: string;
  authorId: string;
  authorName: string;
  authorProfileImg: string;
  content: string;
  mediaUrls: string[];
  likeCount: number;
  commentsCount: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
