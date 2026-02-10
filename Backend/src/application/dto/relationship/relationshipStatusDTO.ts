import { ConnectionStatus, RelationshipType } from "@domain/enum/connectionStatus";

export interface RelationshipStatusDTO {
  isConnected: boolean;
  type: RelationshipType | null;
  status: ConnectionStatus | null;
}
