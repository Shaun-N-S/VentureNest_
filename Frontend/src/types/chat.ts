import type { MessageStatus } from "./messageStatus";
import type { MessageType } from "./messageType";
import type { UserRole } from "./UserRole";

export interface ConversationPreview {
  id: string;

  otherUser: {
    id: string;
    userName: string;
    profileImg?: string;
    role: UserRole;
  };

  lastMessage?: {
    text: string;
    sentAt: string; // ISO string
  };
}

export interface ConversationListResponse {
  conversations: ConversationPreview[];
  total: number;
}

export interface MessageDTO {
  _id: string;
  conversationId: string;

  senderId: string;
  senderRole: UserRole;

  content: string;

  messageType: MessageType;
  status: MessageStatus;

  createdAt: string;
  updatedAt: string;
}

export interface MessageListResponse {
  messages: MessageDTO[];
  total: number;
}

export interface CreateConversationResponse {
  conversationId: string;
}

export interface SendMessageResponse {
  messageId: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;

  senderId: string;
  senderRole: UserRole;

  content: string;

  messageType: MessageType;
  status: MessageStatus;

  createdAt: string;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  total: number;
}
