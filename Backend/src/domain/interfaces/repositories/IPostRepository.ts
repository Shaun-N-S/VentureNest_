import { PostEntity } from "@domain/entities/post/postEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IPostRepository extends IBaseRepository<PostEntity> {
  findPersonalPostWithCount(
    authorId: string,
    skip: number,
    limit: number
  ): Promise<{ posts: PostEntity[]; total: number }>;

  findAllPosts(
    skip: number,
    limit: number
  ): Promise<{ posts: PostEntity[]; total: number; hasNextPage: boolean }>;
}
