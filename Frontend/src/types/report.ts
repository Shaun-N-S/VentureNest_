export const ReportStatus = {
  PENDING: "pending",
  REVIEWED: "reviewed",
  REJECTED: "rejected",
  ACTION_TAKEN: "action_taken",
  ARCHIVED: "archived",
} as const;

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const ReportReason = {
  SPAM: "spam",
  HARASSMENT: "harassment",
  FAKE_INFO: "fake_info",
  COPYRIGHT: "copyright",
  OTHER: "other",
} as const;

export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason];
