import { PostEntity } from "@domain/entities/post/postEntity";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { ICreatePostUseCase } from "@domain/interfaces/useCases/post/ICreatePostUseCase";
import { CreatePostDTO } from "application/dto/post/postDTO";
import { PostMapper } from "application/mappers/postMapper";

export class CreatePostUseCase implements ICreatePostUseCase {
  constructor(
    private _postRepository: IPostRepository,
    private _storageService: IStorageService
  ) {}

  async createPost(data: CreatePostDTO): Promise<void> {
    console.log("data in the useCase", data);

    const { authorId, mediaUrls = [] } = data;

    const uploadedMediaUrls = await Promise.all(
      mediaUrls.map(async (file) => {
        const key = `${StorageFolderNames.POST_MEDIA}/${authorId}-${Date.now()}`;
        const url = await this._storageService.upload(file, key);
        return url;
      })
    );

    const postData: PostEntity = PostMapper.createToEntity({
      ...data,
      mediaUrls: uploadedMediaUrls,
    });

    await this._postRepository.save(postData);
  }
}
