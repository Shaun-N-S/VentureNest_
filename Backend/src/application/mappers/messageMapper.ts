import mongoose from "mongoose";
import { IMessageModel } from "@infrastructure/db/models/messageModel";
import { Message } from "@domain/entities/chat/messageEntity";
import { MessageStatus } from "@domain/enum/messageStatus";
import { MessageType } from "@domain/enum/messageType";
import { SendMessageReqDTO } from "application/dto/chat/sendMessageDTO";

export class MessageMapper {
  static toMongooseDocument(message: Message) {
    return {
      _id: message._id ? new mongoose.Types.ObjectId(message._id) : undefined,

      conversationId: new mongoose.Types.ObjectId(message.conversationId),

      senderId: new mongoose.Types.ObjectId(message.senderId),
      senderRole: message.senderRole,

      content: message.content,

      messageType: message.messageType,

      status: message.status,

      isDeleted: message.isDeleted,

      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IMessageModel): Message {
    return {
      _id: doc._id.toString(),

      conversationId: doc.conversationId.toString(),

      senderId: doc.senderId.toString(),
      senderRole: doc.senderRole,

      content: doc.content,

      messageType: doc.messageType as MessageType,

      status: doc.status as MessageStatus,

      isDeleted: doc.isDeleted,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static fromSendDTO(dto: SendMessageReqDTO): Omit<Message, "_id"> {
    return {
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      senderRole: dto.senderRole,
      content: dto.content,
      messageType: dto.messageType,
      status: MessageStatus.SENT,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
