import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchPersonalPostUseCase } from "@domain/interfaces/useCases/post/IFetchPersonalPostUseCase";
import { PostResDTO } from "application/dto/post/postDTO";
import { PostMapper } from "application/mappers/postMapper";

export class FetchPersonalPostUseCase implements IFetchPersonalPostUseCase {
  constructor(
    private _postRepository: IPostRepository,
    private _storageService: IStorageService
  ) {}

  async fetchPersonalPost(
    authorId: string,
    page: number,
    limit: number
  ): Promise<{ posts: PostResDTO[]; totalPosts: number; hasNextPage: boolean }> {
    const skip = (page - 1) * limit;

    const { posts: personalPosts, total } = await this._postRepository.findPersonalPostWithCount(
      authorId,
      skip,
      limit
    );

    let posts: PostResDTO[] = personalPosts.map((post) => PostMapper.toDTO(post));

    posts = await Promise.all(
      posts.map(async (post) => {
        if (post.mediaUrls && post.mediaUrls.length > 0) {
          post.mediaUrls = await Promise.all(
            post.mediaUrls.map(async (url) => {
              return await this._storageService.createSignedUrl(url, 10 * 60);
            })
          );
        }

        return post;
      })
    );

    const hasNextPage = total > page * limit;

    return { posts, totalPosts: total, hasNextPage };
  }
}
