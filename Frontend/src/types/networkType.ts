import type { ConnectionStatus } from "./connectionStatus";
import type { UserRole } from "./UserRole";

export interface NetworkUser {
  id: string;
  userName: string;
  role: UserRole;
  bio: string;
  profileImg: string;
  createdAt: string;
  type: "USER" | "INVESTOR";
  connectionStatus: ConnectionStatus;
}
