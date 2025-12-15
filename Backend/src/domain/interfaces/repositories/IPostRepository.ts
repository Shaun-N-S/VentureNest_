import { PostEntity } from "@domain/entities/post/postEntity";
import { IBaseRepository } from "./IBaseRepository";
import { UserRole } from "@domain/enum/userRole";

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

  addLike(postId: string, likerId: string, likerRole: UserRole): Promise<void>;
  removeLike(postId: string, likerId: string): Promise<void>;

  findPostsMatchingInterests(interests: string[]): Promise<PostEntity[]>;
  findPostsBySimilarAuthors(interests: string[]): Promise<PostEntity[]>;
  findPostsByAuthorsWithCommonInterests(interests: string[]): Promise<PostEntity[]>;
}
