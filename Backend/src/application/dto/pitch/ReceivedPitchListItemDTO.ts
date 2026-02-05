import { PitchStatus } from "@domain/enum/pitchStatus";

export interface ReceivedPitchListItemDTO {
  pitchId: string;

  projectId: string;
  projectName: string;
  projectLogoUrl?: string;

  founderId: string;
  founderName: string;
  founderProfileImg?: string;

  subject: string;
  status: PitchStatus;
  createdAt: string;
}
