import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { NotFoundExecption } from "application/constants/exceptions";
import { POST_ERRORS } from "@shared/constants/error";
import { IAdminRemovePostUseCase } from "@domain/interfaces/useCases/admin/post/IAdminRemovePostUseCase";

export class AdminRemovePostUseCase implements IAdminRemovePostUseCase {
  constructor(
    private _postRepository: IPostRepository,
    private _storageService: IStorageService
  ) {}

  async execute(postId: string): Promise<{ isActive: boolean }> {
    const post = await this._postRepository.findById(postId);

    if (!post) {
      throw new NotFoundExecption(POST_ERRORS.NO_POST_FOUND);
    }

    const updatedStatus = !post.isActive;

    await this._postRepository.update(postId, {
      isActive: updatedStatus,
    });

    return { isActive: updatedStatus };
  }
}
