import { Conversation } from "@domain/entities/chat/conversationEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PopulatedConversationRepoDTO } from "application/dto/chat/getConversationDTO";

export interface IConversationRepository extends IBaseRepository<Conversation> {
  findBetweenUsers(userOneId: string, userTwoId: string): Promise<Conversation | null>;

  findUserConversations(
    userId: string,
    skip: number,
    limit: number
  ): Promise<PopulatedConversationRepoDTO[]>;

  countUserConversations(userId: string): Promise<number>;

  updateLastMessage(
    conversationId: string,
    lastMessage: {
      senderId: string;
      text: string;
      sentAt: Date;
    }
  ): Promise<void>;
}
