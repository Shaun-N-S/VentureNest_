export const ProjectRegistrationStatus = {
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
} as const;

export type ProjectRegistrationStatus =
  (typeof ProjectRegistrationStatus)[keyof typeof ProjectRegistrationStatus];
