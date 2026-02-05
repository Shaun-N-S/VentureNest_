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

export interface ReceivedPitchListItem {
  pitchId: string;
  projectId: string;
  projectName: string;
  founderId: string;
  founderName: string;
  subject: string;
  status: PitchStatus;
  createdAt: string;
}

export interface SentPitchListItem {
  pitchId: string;

  projectId: string;
  projectName: string;
  projectLogoUrl?: string;

  investorId: string;
  investorName: string;
  investorProfileImg?: string;

  subject: string;
  status: PitchStatus;
  createdAt: string;
}

export interface RespondPitchPayload {
  pitchId: string;
  message: string;
}

export interface InvestorReply {
  message: string;
  repliedAt: string;
}

export interface PitchDetailsResponse {
  pitchId: string;
  subject: string;
  message: string;
  status: PitchStatus;
  createdAt: string;

  investorReply?: InvestorReply;

  project: {
    id: string;
    name: string;
    logoUrl?: string;
  };

  founder: {
    id: string;
    name: string;
    profileImg?: string;
  };

  investor: {
    id: string;
    companyName: string;
    profileImg?: string;
  };
}
