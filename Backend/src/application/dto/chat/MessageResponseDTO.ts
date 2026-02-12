import { MessageStatus } from "@domain/enum/messageStatus";
import { MessageType } from "@domain/enum/messageType";

export interface MessageResponseDTO {
  messageId: string;
  conversationId: string;

  senderId: string;
  content: string;

  messageType: MessageType;
  status: MessageStatus;

  createdAt: Date;
}

export interface MarkConversationReadReqDTO {
  conversationId: string;
  userId: string;
}

export interface MarkConversationReadResDTO {
  success: boolean;
}

export interface GetUnreadCountReqDTO {
  userId: string;
}

export interface GetUnreadCountResDTO {
  unreadCount: number;
}
