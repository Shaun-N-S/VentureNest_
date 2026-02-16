import mongoose from "mongoose";
import { IConversationModel } from "@infrastructure/db/models/conversationModel";
import { Conversation, ConversationParticipant } from "@domain/entities/chat/conversationEntity";
import { UserRole } from "@domain/enum/userRole";
import { CreateConversationReqDTO } from "application/dto/chat/createConversationDTO";

export class ConversationMapper {
  static toMongooseDocument(conversation: Conversation) {
    return {
      _id: conversation._id ? new mongoose.Types.ObjectId(conversation._id) : undefined,

      participants: conversation.participants.map((p) => ({
        userId: new mongoose.Types.ObjectId(p.userId),
        role: p.role,
        model: p.model,
      })),
      lastMessage: conversation.lastMessage
        ? {
            senderId: new mongoose.Types.ObjectId(conversation.lastMessage.senderId),
            text: conversation.lastMessage.text,
            sentAt: conversation.lastMessage.sentAt,
          }
        : undefined,

      isActive: conversation.isActive,

      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IConversationModel): Conversation {
    const baseConversation: Conversation = {
      _id: doc._id.toString(),

      participants: doc.participants.map((p) => ({
        userId: p.userId.toString(),
        role: p.role as UserRole,
        model: p.model as "User" | "Investor",
      })) as [ConversationParticipant, ConversationParticipant],

      isActive: doc.isActive,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    if (doc.lastMessage) {
      baseConversation.lastMessage = {
        senderId: doc.lastMessage.senderId.toString(),
        text: doc.lastMessage.text,
        sentAt: doc.lastMessage.sentAt,
      };
    }

    return baseConversation;
  }

  static fromCreateDTO(dto: CreateConversationReqDTO): Conversation {
    return {
      participants: [
        {
          userId: dto.currentUserId,
          role: dto.currentUserRole,
          model: dto.currentUserRole === UserRole.INVESTOR ? "Investor" : "User",
        },
        {
          userId: dto.targetUserId,
          role: dto.targetUserRole,
          model: dto.targetUserRole === UserRole.INVESTOR ? "Investor" : "User",
        },
      ],
      isActive: true,

      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
