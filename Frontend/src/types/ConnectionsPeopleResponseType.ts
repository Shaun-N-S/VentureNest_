import type { ConnectionStatus, RelationshipType } from "./connectionStatus";

export interface ConnectionsUserDTO {
  id: string;
  userName: string;
  role: string;
  bio?: string;
  profileImg?: string;
  createdAt: string;
  type: string;
  connectionStatus: string;
}

export interface ConnectionsPeopleResponse {
  users: ConnectionsUserDTO[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}


export interface RelationshipStatus {
  isConnected: boolean;
  type: RelationshipType | null;
  status: ConnectionStatus | null;
}


