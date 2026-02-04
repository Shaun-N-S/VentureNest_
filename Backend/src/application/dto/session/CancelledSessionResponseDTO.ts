import { SessionStatus } from "@domain/enum/sessionStatus";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";

export interface CancelledSessionResponseDTO {
  sessionId: string;
  status: SessionStatus;
  cancelledBy: SessionCancelledBy;
  cancelReason: string;
  updatedAt: Date;
}
