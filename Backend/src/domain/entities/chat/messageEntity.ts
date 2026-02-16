import { MessageStatus } from "@domain/enum/messageStatus";
import { MessageType } from "@domain/enum/messageType";
import { UserRole } from "@domain/enum/userRole";

export interface Message {
  _id?: string;

  conversationId: string;

  senderId: string;
  senderRole: UserRole;

  content: string;

  messageType: MessageType;

  status: MessageStatus;

  createdAt: Date;
  updatedAt: Date;

  isDeleted: boolean;
}
