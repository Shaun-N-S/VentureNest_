import { PostEntity } from "@domain/entities/post/postEntity";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { ICreatePostUseCase } from "@domain/interfaces/useCases/post/ICreatePostUseCase";
import { CreatePostDTO } from "application/dto/post/postDTO";
import { PostMapper } from "application/mappers/postMapper";
import { now } from "mongoose";

export class CreatePostUseCase implements ICreatePostUseCase {
  constructor(
    private _postRepository: IPostRepository,
    private _storageService: IStorageService
  ) {}

  async createPost(data: CreatePostDTO): Promise<void> {
    console.log("data in the useCase", data);
    //i can only post once in 2 days

    const { authorId, mediaUrls = [] } = data;

    // const lastestPost = await this._postRepository.findById(authorId);

    // let timeLimit = lastestPost?.createdAt?.toLocaleString() - new Date().toLocaleString();

    // if (timeLimit > 2) {
    //   throw new Error("limit exceed");
    // }

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

    await this._postRepository.save(postData);
  }
}
