import { PostResDTO } from "application/dto/post/postDTO";

export interface IFetchAllPostsUseCase {
  fetchAllPosts(
    page: number,
    limit: number
  ): Promise<{ posts: PostResDTO[]; totalPosts: number; hasNextPage: boolean }>;
}
