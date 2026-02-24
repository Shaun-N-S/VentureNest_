export const ProjectRegistrationStatus = {
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PENDING: "Pending",
} as const;

export type ProjectRegistrationStatus =
  (typeof ProjectRegistrationStatus)[keyof typeof ProjectRegistrationStatus];
