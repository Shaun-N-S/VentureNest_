import { ConnectionStatus, RelationshipType } from "@domain/enum/connectionStatus";

export interface RelationshipResDTO {
  _id: string;
  fromUserId: string;
  toUserId: string;
  type: RelationshipType;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRelationshipDTO {
  fromUserId: string;
  toUserId: string;
  type: RelationshipType;
}

export interface UpdateRelationshipStatusDTO {
  relationshipId: string;
  status: ConnectionStatus;
}
