import { Document, model, Types } from "mongoose";
import ticketSchema from "../schema/ticketSchema";

export interface ITicketModel extends Document {
  _id: Types.ObjectId;
  ticketNumber: string;
  investorId: Types.ObjectId;
  founderId: Types.ObjectId;
  projectId: Types.ObjectId;
  companyName?: string;
  stage: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ticketModel = model<ITicketModel>("Ticket", ticketSchema);
