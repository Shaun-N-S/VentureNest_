import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";

export interface CancelSessionDTO {
  sessionId: string;
  userId: string;
  cancelledBy: SessionCancelledBy;
  reason: string;
}
