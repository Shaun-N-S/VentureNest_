import { PostEntity } from "@domain/entities/post/postEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IPostRepository extends IBaseRepository<PostEntity> {}
