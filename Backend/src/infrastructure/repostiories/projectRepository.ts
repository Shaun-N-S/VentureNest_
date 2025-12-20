import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { BaseRepository } from "./baseRepository";
import { IProjectModel } from "@infrastructure/db/models/projectModel";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { Model } from "mongoose";
import { ProjectMapper } from "application/mappers/projectMapper";
import { PopulatedProjectRepoDTO } from "application/dto/project/projectDTO";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";

export class ProjectRepository
  extends BaseRepository<ProjectEntity, IProjectModel>
  implements IProjectRepository
{
  constructor(protected _model: Model<IProjectModel>) {
    super(_model, ProjectMapper);
  }

  async findPersonalProjects(userId: string, skip: number, limit: number) {
    const [docs, total] = await Promise.all([
      this._model.find({ userId, isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._model.countDocuments({ userId }),
    ]);

    return {
      projects: docs.map((doc) => ProjectMapper.fromMongooseDocument(doc)),
      total,
    };
  }

  async findAllProjects(
    skip: number,
    limit: number,
    search?: string,
    stage?: string,
    sector?: string
  ) {
    const filter: any = { isActive: true };

    if (search) {
      filter.startupName = { $regex: search, $options: "i" };
    }

    if (stage) filter.stage = stage;
    if (sector) filter.category = sector;

    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._model.countDocuments(filter),
    ]);

    return {
      projects: docs.map((doc) => ProjectMapper.fromMongooseDocument(doc)),
      total,
      hasNextPage: skip + docs.length < total,
    };
  }

  async fetchPopulatedProjectById(id: string): Promise<PopulatedProjectRepoDTO | null> {
    const doc = await this._model.findById(id).populate("userId", "userName profileImg");

    if (!doc) return null;

    return ProjectMapper.fromMongooseDocumentPopulated(doc);
  }

  async addLike(projectId: string, likerId: string, likerRole: UserRole): Promise<void> {
    await this._model.updateOne(
      { _id: projectId },
      {
        $push: { likes: { likerId, likerRole } },
        $inc: { likeCount: 1 },
      }
    );
  }

  async removeLike(projectId: string, likerId: string): Promise<void> {
    await this._model.updateOne(
      { _id: projectId },
      {
        $pull: { likes: { likerId } },
        $inc: { likeCount: -1 },
      }
    );
  }

  async updateStatus(projectId: string, status: UserStatus): Promise<ProjectEntity | null> {
    const isActive = status === UserStatus.ACTIVE;

    const updatedDoc = await this._model.findByIdAndUpdate(projectId, { isActive }, { new: true });

    if (!updatedDoc) return null;

    return ProjectMapper.fromMongooseDocument(updatedDoc);
  }

  async findAllAdmin(
    skip: number,
    limit: number,
    status?: string,
    stage?: string[],
    search?: string
  ): Promise<ProjectEntity[]> {
    const query: any = {};

    // status filter
    if (status) {
      query.isActive = status === "ACTIVE";
    }

    if (stage) {
      query.stage = stage;
      // stage.map((s) => {
      //   query.stage = s;
      // });
      console.log("stages in repo :", stage);
    }

    // search filter
    if (search) {
      query.$or = [
        { startupName: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const docs = await this._model
      .find(query)
      .populate("userId", "userName profileImg")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return docs.map((doc) => ProjectMapper.fromMongooseDocument(doc));
  }

  async countAdmin(status?: string, search?: string): Promise<number> {
    const query: any = {};

    if (status) {
      query.isActive = status === "ACTIVE";
    }

    if (search) {
      query.$or = [
        { startupName: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    return this._model.countDocuments(query);
  }

  async countProjectsByAuthor(userId: string): Promise<number> {
    return this._model.countDocuments({
      userId,
      isActive: true,
    });
  }
}
