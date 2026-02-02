import { Document, model, Types } from "mongoose";
import sessionSchema from "../schema/sessionSchema";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";

export interface ISessionModel extends Document {
  _id: Types.ObjectId;
  ticketId: Types.ObjectId;
  investorId: Types.ObjectId;
  founderId: Types.ObjectId;
  projectId: Types.ObjectId;
  sessionName: string;
  date: Date;
  duration: number;
  status: string;
  cancelledBy?: SessionCancelledBy;
  cancelReason?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const sessionModel = model<ISessionModel>("Session", sessionSchema);
