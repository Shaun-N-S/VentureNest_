import { PostEntity } from "@domain/entities/post/postEntity";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { ICreatePostUseCase } from "@domain/interfaces/useCases/post/ICreatePostUseCase";
import { CreatePostDTO } from "application/dto/post/postDTO";
import { PostMapper } from "application/mappers/postMapper";

export class CreatePostUseCase implements ICreatePostUseCase {
  constructor(private _postRepository: IPostRepository) {}

  async createPost(data: CreatePostDTO): Promise<void> {
    const postData: PostEntity = PostMapper.createToEntity(data);

    await this._postRepository.save(postData);
  }
}
