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

  async findPersonalPostWithCount(authorId: string, skip: number, limit: number) {
    const [docs, total] = await Promise.all([
      this._model
        .find({ authorId, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments({ authorId }),
    ]);

    const posts = docs.map((doc) => PostMapper.fromMongooseDocument(doc));
    return { posts, total };
  }

  async findAllPosts(
    skip: number,
    limit: number
  ): Promise<{ posts: PostEntity[]; total: number; hasNextPage: boolean }> {
    const filter = { isDeleted: false };
    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("author"),
      this._model.countDocuments(),
    ]);
    console.log("docuements", docs);
    const posts = docs.map((doc) => PostMapper.fromMongooseDocument(doc));
    const hasNextPage = skip + docs.length < total;

    return { posts, total, hasNextPage };
  }
}
