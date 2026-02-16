import { Message } from "@domain/entities/chat/messageEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IMessageRepository extends IBaseRepository<Message> {
  findByConversation(conversationId: string, skip: number, limit: number): Promise<Message[]>;

  countByConversation(conversationId: string): Promise<number>;

  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;

  countUnreadByUser(userId: string): Promise<number>;
}
