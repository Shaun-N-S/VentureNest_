import { RelationshipEntity } from "@domain/entities/follows/RelationshipEntity";
import { BaseRepository } from "./baseRepository";
import { IRelationshipModel } from "@infrastructure/db/models/relationshipModel";
import { IRelationshipRepository } from "@domain/interfaces/repositories/IRelationshipRepository";
import { Model } from "mongoose";
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
}
