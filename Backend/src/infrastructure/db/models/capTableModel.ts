import { Document, model, Types } from "mongoose";
import capTableSchema from "../schema/capTableSchema";

export interface ICapTableModel extends Document {
  _id: string;

  projectId: Types.ObjectId;

  totalShares: number;

  shareholders: {
    userId: Types.ObjectId;
    shares: number;
    equityPercentage: number;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export const capTableModel = model<ICapTableModel>("CapTable", capTableSchema);
