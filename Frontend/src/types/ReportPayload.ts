import type { ReportReason } from "./reportReason";
import type { ReportTargetType } from "./reportTargetType";

export interface CreateReportPayload {
  reportedItemId: string;
  reportedItemType: ReportTargetType; // "post" | "project"
  reasonCode: ReportReason; // spam | fake_info | etc
  reasonText?: string;
}
