import { RelationshipEntity } from "@domain/entities/follows/RelationshipEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IRelationshipRepository extends IBaseRepository<RelationshipEntity> {
  findRelationship(
    fromUserId: string,
    toUserId: string,
    type: string
  ): Promise<RelationshipEntity | null>;

  findFollowers(userId: string): Promise<RelationshipEntity[]>;

  findFollowing(userId: string): Promise<RelationshipEntity[]>;

  findConnections(userId: string): Promise<RelationshipEntity[]>;

  checkExisting(fromUserId: string, toUserId: string): Promise<RelationshipEntity | null>;
}
