import { AdminPostResDTO } from "application/dto/post/postDTO";

export interface IGetPostByIdUseCase {
  execute(postId: string): Promise<AdminPostResDTO>;
}
