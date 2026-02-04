import { PitchStatus } from "@domain/enum/pitchStatus";

export interface PitchEntity {
  _id?: string;

  projectId: string;
  founderId: string;
  investorId: string;

  subject: string;
  message: string;

  status: PitchStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
