import { PostLikeUserDTO } from "application/dto/post/postLikeUserDTO";

export interface IFetchPostLikesUseCase {
  execute(
    postId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    users: PostLikeUserDTO[];
    hasNextPage: boolean;
  }>;
}
