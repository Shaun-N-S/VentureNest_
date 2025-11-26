import type { ConnectionStatus } from "./connectionStatus";

export interface NetworkProfileCardProps {
  id: string;
  profileImg: string | null;
  name: string;
  role: string;
  desc: string;
  sendConnection: (id: string) => Promise<boolean>;
  connectionStatus: ConnectionStatus;
}
