import { Message } from "@domain/entities/chat/messageEntity";
import { MessageType } from "@domain/enum/messageType";
import { UserRole } from "@domain/enum/userRole";

export interface SendMessageReqDTO {
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  messageType: MessageType;
}

export interface SendMessageResDTO {
  messageId: string;
}

export interface GetMessagesReqDTO {
  conversationId: string;
  page: number;
  limit: number;
}

export interface GetMessagesResDTO {
  messages: Message[];
  total: number;
}
