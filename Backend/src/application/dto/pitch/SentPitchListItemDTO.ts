import { PitchStatus } from "@domain/enum/pitchStatus";

export interface SentPitchListItemDTO {
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
