import { io } from "../socketServer";
import { SocketRooms } from "../socketRooms";
import { IChatEventPublisher } from "@domain/interfaces/services/IChatEventPublisher";
import { Message } from "@domain/entities/chat/messageEntity";

export class SocketChatPublisher implements IChatEventPublisher {
  async publishNewMessage(message: Message, participantIds: string[]): Promise<void> {
    if (!io || !message._id) return;

    const payload = {
      _id: message._id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderRole: message.senderRole,
      content: message.content,
      messageType: message.messageType,
      status: message.status,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    };

    io.to(SocketRooms.conversation(message.conversationId)).emit("chat:new-message", payload);

    participantIds.forEach((userId) => {
      io.to(SocketRooms.user(userId)).emit("chat:conversation-updated", {
        conversationId: message.conversationId,
        lastMessage: {
          text: message.content,
          sentAt: message.createdAt.toISOString(),
        },
      });
    });
  }

  async publishConversationUpdated(data: {
    conversationId: string;
    senderId: string;
    text: string;
    sentAt: Date;
  }): Promise<void> {
    if (!io) return;

    io.to(SocketRooms.conversation(data.conversationId)).emit("chat:conversation-updated", data);
  }
}
