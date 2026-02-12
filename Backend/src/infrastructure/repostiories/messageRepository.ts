import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { Message } from "@domain/entities/chat/messageEntity";
import { IMessageRepository } from "@domain/interfaces/repositories/IMessageRepository";
import { IMessageModel } from "@infrastructure/db/models/messageModel";
import { MessageMapper } from "application/mappers/messageMapper";
import { MessageStatus } from "@domain/enum/messageStatus";

export class MessageRepository
  extends BaseRepository<Message, IMessageModel>
  implements IMessageRepository
{
  constructor(protected _model: Model<IMessageModel>) {
    super(_model, MessageMapper);
  }

  async findByConversation(
    conversationId: string,
    skip: number,
    limit: number
  ): Promise<Message[]> {
    const docs = await this._model
      .find({
        conversationId: new mongoose.Types.ObjectId(conversationId),
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return docs.map((doc) => MessageMapper.fromMongooseDocument(doc));
  }

  async countByConversation(conversationId: string): Promise<number> {
    return this._model.countDocuments({
      conversationId: new mongoose.Types.ObjectId(conversationId),
      isDeleted: false,
    });
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await this._model.updateMany(
      {
        conversationId: new mongoose.Types.ObjectId(conversationId),
        senderId: { $ne: new mongoose.Types.ObjectId(userId) },
        status: MessageStatus.SENT,
      },
      {
        $set: { status: MessageStatus.READ },
      }
    );
  }

  async countUnreadByUser(userId: string): Promise<number> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await mongoose
      .model("Conversation")
      .find({
        "participants.userId": userObjectId,
        isActive: true,
      })
      .select("_id");

    const conversationIds = conversations.map((c) => c._id);

    if (!conversationIds.length) return 0;

    return this._model.countDocuments({
      conversationId: { $in: conversationIds },
      senderId: { $ne: userObjectId },
      status: { $ne: MessageStatus.READ },
      isDeleted: false,
    });
  }
}
