import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { AdminPostMapper } from "application/mappers/adminPostMapper";
import { NotFoundExecption } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { AdminPostResDTO } from "application/dto/post/postDTO";
import { IGetPostByIdUseCase } from "@domain/interfaces/useCases/admin/post/IGetPostByIdUseCase";
import { CONFIG } from "@config/config";

export class GetPostByIdUseCase implements IGetPostByIdUseCase {
  constructor(
    private _postRepo: IPostRepository,
    private _storageService: IStorageService
  ) {}

  async execute(postId: string): Promise<AdminPostResDTO> {
    const post = await this._postRepo.findById(postId);

    if (!post) {
      throw new NotFoundExecption(Errors.INVALID_DATA);
    }

    const dto = AdminPostMapper.toDTO(post);

    dto.mediaUrls = await Promise.all(
      dto.mediaUrls.map((url) =>
        this._storageService.createSignedUrl(url, CONFIG.SIGNED_URL_EXPIRY)
      )
    );

    return dto;
  }
}
