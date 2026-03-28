import mongoose from "mongoose";
import { IMessageModel } from "@infrastructure/db/models/messageModel";
import { Message } from "@domain/entities/chat/messageEntity";
import { MessageStatus } from "@domain/enum/messageStatus";
import { MessageType } from "@domain/enum/messageType";
import { UserRole } from "@domain/enum/userRole";

export class MessageMapper {
  static toMongooseDocument(message: Message) {
    return {
      _id: message._id ? new mongoose.Types.ObjectId(message._id) : undefined,

      conversationId: new mongoose.Types.ObjectId(message.conversationId),

      senderId: new mongoose.Types.ObjectId(message.senderId),
      senderRole: message.senderRole,

      content: message.content,
      fileUrl: message.fileUrl,
      fileName: message.fileName,

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

      ...(doc.content && { content: doc.content }),
      ...(doc.fileUrl && { fileUrl: doc.fileUrl }),
      ...(doc.fileName && { fileName: doc.fileName }),
      messageType: doc.messageType as MessageType,

      status: doc.status as MessageStatus,

      isDeleted: doc.isDeleted,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static fromSendDTO(dto: {
    conversationId: string;
    senderId: string;
    senderRole: UserRole;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    messageType: MessageType;
  }): Omit<Message, "_id"> {
    return {
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      senderRole: dto.senderRole,
      ...(dto.content && { content: dto.content }),
      ...(dto.fileUrl && { fileUrl: dto.fileUrl }),
      ...(dto.fileName && { fileName: dto.fileName }),
      messageType: dto.messageType,
      status: MessageStatus.SENT,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
