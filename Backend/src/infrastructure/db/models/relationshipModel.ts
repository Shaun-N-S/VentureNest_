import { Document, model, Types } from "mongoose";
import relationshipSchema from "../schema/relationshipSchema";
import { ConnectionStatus, RelationshipType } from "@domain/enum/connectionStatus";

export interface IRelationshipModel extends Document {
  _id: string;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  type: RelationshipType;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const relationshipModel = model<IRelationshipModel>("Relationship", relationshipSchema);
