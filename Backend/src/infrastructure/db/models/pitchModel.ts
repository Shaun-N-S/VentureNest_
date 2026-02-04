import { Document, model } from "mongoose";
import pitchSchema from "../schema/pitchSchema";
import { PitchStatus } from "@domain/enum/pitchStatus";

export interface IPitchModel extends Document {
  _id: string;
  projectId: string;
  founderId: string;
  investorId: string;
  subject: string;
  message: string;
  status: PitchStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const pitchModel = model<IPitchModel>("Pitch", pitchSchema);
