import { Message } from "@domain/entities/chat/messageEntity";

export interface IChatEventPublisher {
  publishNewMessage(message: Message, participantIds: string[]): Promise<void>;

  publishConversationUpdated(data: {
    conversationId: string;
    senderId: string;
    text: string;
    sentAt: Date;
  }): Promise<void>;

  publishMessageDelivered(data: { conversationId: string; userId: string }): Promise<void>;

  publishMessageRead(data: { conversationId: string; userId: string }): Promise<void>;

  publishMessageDeleted(data: { messageId: string; conversationId: string }): Promise<void>;
}
