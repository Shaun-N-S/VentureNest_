import { ConnectionStatus, RelationshipType } from "@domain/enum/connectionStatus";
import { UserRole } from "@domain/enum/userRole";

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

export interface NetworkUsersDTO {
  id: string;
  userName: string;
  role: UserRole;
  bio?: string;
  profileImg?: string;
  createdAt?: Date;
  type: UserRole;
  connectionStatus: ConnectionStatus;
}
