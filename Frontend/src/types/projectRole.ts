export const PROJECT_ROLES = [
  "Founder",
  "Co-Founder",
  "Team Member",
  "Advisor",
  "Investor",
] as const;

export type ProjectRoleType = (typeof PROJECT_ROLES)[number];
