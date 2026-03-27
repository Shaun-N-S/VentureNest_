import { Document, model, Types } from "mongoose";
import shareIssuanceSchema from "../schema/shareIssuanceSchema";

export interface IShareIssuanceModel extends Document {
  _id: string;

  projectId: Types.ObjectId;
  dealId: Types.ObjectId;
  investorId: Types.ObjectId;

  sharesIssued: number;
  equityPercentage: number;

  issuedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const shareIssuanceModel = model<IShareIssuanceModel>("ShareIssuance", shareIssuanceSchema);
