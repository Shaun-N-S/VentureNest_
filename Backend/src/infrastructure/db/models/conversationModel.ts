import { Document, model } from "mongoose";
import conversationSchema from "../schema/conversationSchema";
import { UserRole } from "@domain/enum/userRole";

export interface IConversationParticipant {
  userId: string;
  role: UserRole;
  model: "User" | "Investor";
}

export interface ILastMessagePreview {
  senderId: string;
  text: string;
  sentAt: Date;
}

export interface IConversationModel extends Document {
  _id: string;

  participants: [IConversationParticipant, IConversationParticipant];

  lastMessage?: ILastMessagePreview;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const conversationModel = model<IConversationModel>("Conversation", conversationSchema);
