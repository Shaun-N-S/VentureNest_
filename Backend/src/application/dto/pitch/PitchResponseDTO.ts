import { PitchStatus } from "@domain/enum/pitchStatus";

export interface PitchResponseDTO {
  pitchId: string;
  projectId: string;
  founderId: string;
  investorId: string;
  subject: string;
  message: string;
  status: PitchStatus;
  createdAt: Date;
}
