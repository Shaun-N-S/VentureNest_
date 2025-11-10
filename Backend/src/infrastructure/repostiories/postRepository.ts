import { PostEntity } from "@domain/entities/post/postEntity";
import { BaseRepository } from "./baseRepository";
import { IPostModel } from "@infrastructure/db/models/postModel";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { Model } from "mongoose";
import { PostMapper } from "application/mappers/postMapper";

export class PostRepository
  extends BaseRepository<PostEntity, IPostModel>
  implements IPostRepository
{
  constructor(protected _model: Model<IPostModel>) {
    super(_model, PostMapper);
  }
}
