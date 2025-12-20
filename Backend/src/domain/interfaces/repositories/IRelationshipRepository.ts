import { RelationshipEntity } from "@domain/entities/follows/RelationshipEntity";
import { IBaseRepository } from "./IBaseRepository";
import { ConnectionStatus } from "@domain/enum/connectionStatus";

export interface IRelationshipRepository extends IBaseRepository<RelationshipEntity> {
  findRelationship(
    fromUserId: string,
    toUserId: string,
    type: string
  ): Promise<RelationshipEntity | null>;

  findFollowers(userId: string): Promise<RelationshipEntity[]>;

  findFollowing(userId: string): Promise<RelationshipEntity[]>;

  findConnections(userId: string): Promise<RelationshipEntity[]>;

  findPendingRequests(userId: string): Promise<RelationshipEntity[]>;

  checkExisting(fromUserId: string, toUserId: string): Promise<RelationshipEntity | null>;

  updateConnectionStatus(
    fromUserId: string,
    toUserId: string,
    status: ConnectionStatus
  ): Promise<boolean | null>;

  countConnections(userId: string): Promise<number>;
}
