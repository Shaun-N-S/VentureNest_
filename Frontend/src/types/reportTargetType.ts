export const ReportTargetType = {
  POST: "post",
  PROJECT: "project",
} as const;

export type ReportTargetType =
  (typeof ReportTargetType)[keyof typeof ReportTargetType];
