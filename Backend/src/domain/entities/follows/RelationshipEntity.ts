import { ConnectionStatus, RelationshipType } from "@domain/enum/connectionStatus";

export interface RelationshipEntity {
  _id?: string;
  fromUserId: string;
  toUserId: string;
  type: RelationshipType;
  status: ConnectionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
