import { Document, model } from "mongoose";
import messageSchema from "../schema/messageSchema";
import { MessageStatus } from "@domain/enum/messageStatus";
import { MessageType } from "@domain/enum/messageType";
import { UserRole } from "@domain/enum/userRole";

export interface IMessageModel extends Document {
  _id: string;

  conversationId: string;

  senderId: string;
  senderRole: UserRole;

  content: string;

  messageType: MessageType;

  status: MessageStatus;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const messageModel = model<IMessageModel>("Message", messageSchema);
