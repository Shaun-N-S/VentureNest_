import { CreatePostDTO } from "application/dto/post/postDTO";

export interface ICreatePostUseCase {
  createPost(data: CreatePostDTO): Promise<{ postId: string; mediaUrls: string[] }>;
}
