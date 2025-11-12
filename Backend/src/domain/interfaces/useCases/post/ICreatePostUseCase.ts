import { PostEntity } from "@domain/entities/post/postEntity";
import { CreatePostDTO } from "application/dto/post/postDTO";

export interface ICreatePostUseCase {
  createPost(data: CreatePostDTO): Promise<void>;
}
