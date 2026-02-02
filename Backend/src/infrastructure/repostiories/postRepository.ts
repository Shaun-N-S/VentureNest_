import mongoose from "mongoose";
import { PostEntity } from "@domain/entities/post/postEntity";
import { BaseRepository } from "./baseRepository";
import { IPostModel } from "@infrastructure/db/models/postModel";
import { IPostRepository } from "@domain/interfaces/repositories/IPostRepository";
import { Model } from "mongoose";
import { PostMapper } from "application/mappers/postMapper";
import { UserRole } from "@domain/enum/userRole";
import { NotFoundExecption } from "application/constants/exceptions";
import { POST_ERRORS } from "@shared/constants/error";

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

    const posts = docs.map(PostMapper.fromMongooseDocument);
    return { posts, total };
  }

  async findAllPosts(skip: number, limit: number) {
    const filter = { isDeleted: false };
    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("author"),
      this._model.countDocuments(filter),
    ]);

    const posts = docs.map(PostMapper.fromMongooseDocument);
    const hasNextPage = skip + docs.length < total;

    return { posts, total, hasNextPage };
  }

  async findPostsMatchingInterests(interests: string[]): Promise<PostEntity[]> {
    if (!interests.length) return [];

    const docs = await this._model
      .find({
        content: { $regex: interests.join("|"), $options: "i" },
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .populate("author");

    return docs.map(PostMapper.fromMongooseDocument);
  }

  async findPostsBySimilarAuthors(interests: string[]): Promise<PostEntity[]> {
    if (!interests.length) return [];

    const users = await mongoose
      .model("User")
      .find({
        interestedTopics: { $in: interests },
      })
      .select("_id");

    const investors = await mongoose
      .model("Investor")
      .find({
        interestedTopics: { $in: interests },
      })
      .select("_id");

    const authorIds = [...users.map((u) => u._id), ...investors.map((i) => i._id)];

    const docs = await this._model
      .find({
        authorId: { $in: authorIds },
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .populate("author");

    return docs.map(PostMapper.fromMongooseDocument);
  }

  async findPostsByAuthorsWithCommonInterests(interests: string[]): Promise<PostEntity[]> {
    if (!interests.length) return [];

    //Find users who share interests
    const users = await mongoose
      .model("User")
      .find({ interestedTopics: { $in: interests } })
      .select("_id");

    const investors = await mongoose
      .model("Investor")
      .find({ interestedTopics: { $in: interests } })
      .select("_id");

    const authorIds = [
      ...users.map((u) => u._id.toString()),
      ...investors.map((i) => i._id.toString()),
    ];

    if (!authorIds.length) return [];

    // Fetch posts from those authors
    const docs = await this._model
      .find({
        authorId: { $in: authorIds },
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .populate("author");

    return docs.map(PostMapper.fromMongooseDocument);
  }

  async addLike(postId: string, likerId: string, likerRole: UserRole): Promise<void> {
    await this._model.updateOne(
      { _id: postId },
      {
        $push: { likes: { likerId, likerRole } },
        $inc: { likeCount: 1 },
      }
    );
  }

  async removeLike(postId: string, likerId: string): Promise<void> {
    await this._model.updateOne(
      { _id: postId },
      {
        $pull: { likes: { likerId } },
        $inc: { likeCount: -1 },
      }
    );
  }

  async countPostsByAuthor(authorId: string): Promise<number> {
    return this._model.countDocuments({
      authorId,
      isDeleted: false,
    });
  }

  async getPostLikes(postId: string, skip: number, limit: number) {
    const post = await this._model.findById(postId).select("likes");
    if (!post) throw new NotFoundExecption(POST_ERRORS.NO_POST_FOUND);

    const total = post.likes.length;

    const likes = post.likes.slice(skip, skip + limit).map((like) => ({
      likerId: like.likerId.toString(),
      likerRole: like.likerRole,
    }));

    return { likes, total };
  }

  async getPostLikeIds(postId: string) {
    const post = await this._model.findById(postId, { likes: 1 });

    if (!post) {
      throw new NotFoundExecption(POST_ERRORS.NO_POST_FOUND);
    }

    const userIds = post.likes
      .filter((l) => l.likerRole === UserRole.USER)
      .map((l) => l.likerId.toString());

    const investorIds = post.likes
      .filter((l) => l.likerRole === UserRole.INVESTOR)
      .map((l) => l.likerId.toString());

    return { userIds, investorIds };
  }
}
