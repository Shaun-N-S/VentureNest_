import type { UserRole } from "./UserRole";

export interface PostLikeUser {
  id: string;
  name: string;
  profileImg?: string;
  role: UserRole;
  bio?: string;
}

export interface PostLikesPage {
  users: PostLikeUser[];
  hasNextPage: boolean;
}
