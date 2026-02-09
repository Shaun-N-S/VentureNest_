import { RelationshipEntity } from "@domain/entities/follows/RelationshipEntity";
import { BaseRepository } from "./baseRepository";
import { IRelationshipModel } from "@infrastructure/db/models/relationshipModel";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import mongoose, { Model } from "mongoose";
import { RelationshipMapper } from "application/mappers/relationshipMapper";
import { RelationshipType, ConnectionStatus } from "@domain/enum/connectionStatus";

export class RelationshipRepository
  extends BaseRepository<RelationshipEntity, IRelationshipModel>
  implements IRelationshipRepository
{
  constructor(protected _model: Model<IRelationshipModel>) {
    super(_model, RelationshipMapper);
  }

  async findRelationship(
    fromUserId: string,
    toUserId: string,
    type: string
  ): Promise<RelationshipEntity | null> {
    const doc = await this._model.findOne({ fromUserId, toUserId, type });
    return doc ? RelationshipMapper.fromMongooseDocument(doc) : null;
  }

  async checkExisting(fromUserId: string, toUserId: string): Promise<RelationshipEntity | null> {
    const doc = await this._model.findOne({ fromUserId, toUserId });
    return doc ? RelationshipMapper.fromMongooseDocument(doc) : null;
  }

  async findFollowers(userId: string): Promise<RelationshipEntity[]> {
    const docs = await this._model.find({
      toUserId: userId,
      type: RelationshipType.FOLLOW,
    });

    return docs.map((doc) => RelationshipMapper.fromMongooseDocument(doc));
  }

  async findFollowing(userId: string): Promise<RelationshipEntity[]> {
    const docs = await this._model.find({
      fromUserId: userId,
      type: RelationshipType.FOLLOW,
    });

    return docs.map((doc) => RelationshipMapper.fromMongooseDocument(doc));
  }

  async findConnections(userId: string): Promise<RelationshipEntity[]> {
    const docs = await this._model.find({
      $or: [
        {
          fromUserId: userId,
          type: RelationshipType.CONNECTION,
          status: ConnectionStatus.ACCEPTED,
        },
        {
          toUserId: userId,
          type: RelationshipType.CONNECTION,
          status: ConnectionStatus.ACCEPTED,
        },
      ],
    });

    return docs.map((doc) => RelationshipMapper.fromMongooseDocument(doc));
  }

  async findPendingRequests(userId: string): Promise<RelationshipEntity[]> {
    const docs = await this._model.find({
      toUserId: userId,
      status: ConnectionStatus.PENDING,
      type: RelationshipType.CONNECTION,
    });

    return docs.map((doc) => RelationshipMapper.fromMongooseDocument(doc));
  }

  async updateConnectionStatus(
    fromUserId: string,
    toUserId: string,
    status: ConnectionStatus
  ): Promise<boolean | null> {
    const updated = await this._model.updateOne(
      { fromUserId, toUserId, type: RelationshipType.CONNECTION },
      { $set: { status, updatedAt: new Date() } }
    );
    return updated.modifiedCount > 0;
  }

  async countConnections(userId: string): Promise<number> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const result = await this._model.aggregate([
      {
        $match: {
          type: RelationshipType.CONNECTION,
          status: ConnectionStatus.ACCEPTED,
          $or: [{ fromUserId: userObjectId }, { toUserId: userObjectId }],
        },
      },
      {
        $project: {
          connectedUser: {
            $cond: [{ $eq: ["$fromUserId", userObjectId] }, "$toUserId", "$fromUserId"],
          },
        },
      },
      {
        $group: { _id: "$connectedUser" },
      },
      {
        $count: "count",
      },
    ]);

    return result[0]?.count || 0;
  }

  async removeConnection(userId1: string, userId2: string): Promise<boolean> {
    const result = await this._model.deleteOne({
      type: RelationshipType.CONNECTION,
      status: ConnectionStatus.ACCEPTED,
      $or: [
        { fromUserId: userId1, toUserId: userId2 },
        { fromUserId: userId2, toUserId: userId1 },
      ],
    });

    return result.deletedCount === 1;
  }

  async findBetweenUsers(userId1: string, userId2: string): Promise<RelationshipEntity | null> {
    const doc = await this._model.findOne({
      $or: [
        { fromUserId: userId1, toUserId: userId2 },
        { fromUserId: userId2, toUserId: userId1 },
      ],
    });

    return doc ? RelationshipMapper.fromMongooseDocument(doc) : null;
  }
}
