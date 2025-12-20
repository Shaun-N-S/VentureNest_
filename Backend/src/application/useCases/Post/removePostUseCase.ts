import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IRemovePostUseCase } from "@domain/interfaces/useCases/post/IRemovePostUseCase";
import { Errors, POST_ERRORS } from "@shared/constants/error";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";

export class RemovePostUseCase implements IRemovePostUseCase {
  constructor(
    private _postRepository: IPostRepository,
    private _storageService: IStorageService
  ) {}

  async removePost(postId: string, userId: string): Promise<void> {
    const post = await this._postRepository.findById(postId);
    console.log(post);
    if (!post) {
      throw new NotFoundExecption(POST_ERRORS.NO_POST_FOUND);
    }

    if (post.authorId.toString() !== userId) {
      throw new InvalidDataException(Errors.UNAUTHORIZED_ACCESS);
    }

    await this._postRepository.update(postId, { isDeleted: true });
    await Promise.all(post.mediaUrls!.map((url) => this._storageService.delete(url)));
  }
}
