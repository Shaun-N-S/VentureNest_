export const ReportReason = {
  SPAM: "spam",
  HARASSMENT: "harassment",
  FAKE_INFO: "fake_info",
  COPYRIGHT: "copyright",
  OTHER: "other",
} as const;

export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason];
