import { PitchStatus } from "@domain/enum/pitchStatus";

export interface PopulatedFounder {
  _id: string;
  userName: string;
  profileImg?: string;
}

export interface PopulatedInvestor {
  _id: string;
  companyName: string;
  profileImg?: string;
}

export interface PopulatedProject {
  _id: string;
  startupName: string;
  logoUrl?: string;
}

export interface ReceivedPitchPopulated {
  _id: string;
  subject: string;
  status: PitchStatus;
  createdAt: Date;

  founderId: PopulatedFounder;
  projectId: PopulatedProject;
}

export interface SentPitchPopulated {
  _id: string;
  subject: string;
  status: PitchStatus;
  createdAt: Date;

  investorId: PopulatedInvestor;
  projectId: PopulatedProject;
}
