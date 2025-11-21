import { PostResDTO } from "application/dto/post/postDTO";

export interface IFetchPersonalPostUseCase {
  fetchPersonalPost(
    authorId: string,
    page: number,
    limit: number
  ): Promise<{ posts: PostResDTO[]; totalPosts: number; hasNextPage: boolean }>;
}
