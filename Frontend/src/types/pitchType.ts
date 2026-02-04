export const PitchStatus = {
  SENT: "SENT",
  VIEWED: "VIEWED",
  RESPONDED: "RESPONDED",
} as const;

export type PitchStatus = (typeof PitchStatus)[keyof typeof PitchStatus];

export interface CreatePitchPayload {
  projectId: string;
  investorId: string;
  subject: string;
  message: string;
}

export interface PitchResponse {
  pitchId: string;
  projectId: string;
  founderId: string;
  investorId: string;
  subject: string;
  message: string;
  status: PitchStatus;
  createdAt: string;
}
