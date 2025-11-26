export const TEAM_SIZES = [
  "Solo Founder",
  "Duo",
  "Small Team",
  "Growing Team",
] as const;

export type TeamSizeType = (typeof TEAM_SIZES)[number];
