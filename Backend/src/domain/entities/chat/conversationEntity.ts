import { UserRole } from "@domain/enum/userRole";

export interface ConversationParticipant {
  userId: string;
  role: UserRole;
  model: "User" | "Investor";
}

export interface LastMessagePreview {
  senderId: string;
  text: string;
  sentAt: Date;
}

export interface Conversation {
  _id?: string;

  participants: [ConversationParticipant, ConversationParticipant];

  lastMessage?: LastMessagePreview;

  createdAt: Date;
  updatedAt: Date;

  isActive: boolean;
}
