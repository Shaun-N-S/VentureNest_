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

  async createPost(data: CreatePostDTO): Promise<{ postId: string; mediaUrls: string[] }> {
    console.log("data in the useCase", data);
    const { authorId, mediaUrls = [] } = data;

    const uploadedMediaUrls = await Promise.all(
      mediaUrls.map(async (file, i) => {
        const key = `${StorageFolderNames.POST_MEDIA}/${authorId}-${Date.now()}${i}`;
        const url = await this._storageService.upload(file, key);
        return url;
      })
    );

    const postData: PostEntity = PostMapper.createToEntity({
      ...data,
      mediaUrls: uploadedMediaUrls,
    });

    const savedPost = await this._postRepository.save(postData);

    const signedMediaUrls = await Promise.all(
      uploadedMediaUrls.map(async (url) => {
        return await this._storageService.createSignedUrl(url, 10 * 60);
      })
    );

    return {
      postId: savedPost._id!,
      mediaUrls: signedMediaUrls,
    };
  }
}
