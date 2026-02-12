import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { Conversation } from "@domain/entities/chat/conversationEntity";
import { IConversationRepository } from "@domain/interfaces/repositories/IConversationRepository";
import { IConversationModel } from "@infrastructure/db/models/conversationModel";
import {
  PopulatedConversationRepoDTO,
  PopulatedParticipantDTO,
} from "application/dto/chat/getConversationDTO";
import { UserRole } from "@domain/enum/userRole";
import { ConversationMapper } from "application/mappers/conversationMapper";

interface PopulatedUserDoc {
  _id: mongoose.Types.ObjectId;
  userName?: string;
  companyName?: string;
  profileImg?: string;
}

interface PopulatedParticipantDoc {
  userId: PopulatedUserDoc;
  role: UserRole;
}

interface PopulatedConversationDoc {
  _id: mongoose.Types.ObjectId;
  participants: [PopulatedParticipantDoc, PopulatedParticipantDoc];
  lastMessage?: {
    senderId: mongoose.Types.ObjectId;
    text: string;
    sentAt: Date;
  };
  updatedAt: Date;
}

export class ConversationRepository
  extends BaseRepository<Conversation, IConversationModel>
  implements IConversationRepository
{
  constructor(protected _model: Model<IConversationModel>) {
    super(_model, ConversationMapper);
  }

  async findBetweenUsers(userOneId: string, userTwoId: string): Promise<Conversation | null> {
    const doc = await this._model.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: new mongoose.Types.ObjectId(userOneId) } },
          { $elemMatch: { userId: new mongoose.Types.ObjectId(userTwoId) } },
        ],
      },
    });

    return doc ? ConversationMapper.fromMongooseDocument(doc) : null;
  }

  async findUserConversations(
    userId: string,
    skip: number,
    limit: number
  ): Promise<PopulatedConversationRepoDTO[]> {
    const docs = await this._model
      .find({
        "participants.userId": new mongoose.Types.ObjectId(userId),
        isActive: true,
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "participants.userId",
        select: "userName companyName profileImg",
      })
      .lean<PopulatedConversationDoc[]>();
    console.log("doc from db  :  : ", docs);
    return docs.map((doc) => {
      const participants: [PopulatedParticipantDTO, PopulatedParticipantDTO] = doc.participants.map(
        (p) => ({
          userId: p.userId._id.toString(),
          role: p.role,
          userName: p.userId.userName ?? p.userId.companyName ?? "Unknown",
          ...(p.userId.profileImg && {
            profileImg: p.userId.profileImg,
          }),
        })
      ) as [PopulatedParticipantDTO, PopulatedParticipantDTO];

      return {
        _id: doc._id.toString(),
        participants,
        ...(doc.lastMessage && {
          lastMessage: {
            senderId: doc.lastMessage.senderId.toString(),
            text: doc.lastMessage.text,
            sentAt: doc.lastMessage.sentAt,
          },
        }),
        updatedAt: doc.updatedAt,
      };
    });
  }

  async countUserConversations(userId: string): Promise<number> {
    return this._model.countDocuments({
      "participants.userId": new mongoose.Types.ObjectId(userId),
      isActive: true,
    });
  }

  async updateLastMessage(
    conversationId: string,
    lastMessage: {
      senderId: string;
      text: string;
      sentAt: Date;
    }
  ): Promise<void> {
    await this._model.findByIdAndUpdate(conversationId, {
      $set: {
        lastMessage: {
          senderId: new mongoose.Types.ObjectId(lastMessage.senderId),
          senderModel: "User",
          text: lastMessage.text,
          sentAt: lastMessage.sentAt,
        },
        updatedAt: new Date(),
      },
    });
  }
}
