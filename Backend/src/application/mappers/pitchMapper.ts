import mongoose from "mongoose";
import { PitchEntity } from "@domain/entities/pitch/pitchEntity";
import { IPitchModel } from "@infrastructure/db/models/pitchModel";
import { PitchResponseDTO } from "application/dto/pitch/PitchResponseDTO";
import {
  ReceivedPitchPopulated,
  SentPitchPopulated,
} from "application/dto/pitch/PitchPopulatedTypes";
import { SentPitchListItemDTO } from "application/dto/pitch/SentPitchListItemDTO";
import { ReceivedPitchListItemDTO } from "application/dto/pitch/ReceivedPitchListItemDTO";
import {
  PitchDetailsPopulated,
  PitchDetailsResponseDTO,
} from "application/dto/pitch/PitchDetailsResponseDTO";

export class PitchMapper {
  static toMongooseDocument(entity: PitchEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      founderId: new mongoose.Types.ObjectId(entity.founderId),
      investorId: new mongoose.Types.ObjectId(entity.investorId),
      subject: entity.subject,
      message: entity.message,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IPitchModel): PitchEntity {
    return {
      _id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      founderId: doc.founderId.toString(),
      investorId: doc.investorId.toString(),
      subject: doc.subject,
      message: doc.message,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDTO(entity: PitchEntity): PitchResponseDTO {
    return {
      pitchId: entity._id!,
      projectId: entity.projectId,
      founderId: entity.founderId,
      investorId: entity.investorId,
      subject: entity.subject,
      message: entity.message,
      status: entity.status,
      createdAt: entity.createdAt!,
    };
  }

  static toReceivedPitchListFromPopulated(
    pitches: ReceivedPitchPopulated[]
  ): ReceivedPitchListItemDTO[] {
    return pitches.map((p) => ({
      pitchId: p._id,
      projectId: p.projectId._id,
      projectName: p.projectId.startupName,

      ...(p.projectId.logoUrl && {
        projectLogoUrl: p.projectId.logoUrl,
      }),

      founderId: p.founderId._id,
      founderName: p.founderId.userName,

      ...(p.founderId.profileImg && {
        founderProfileImg: p.founderId.profileImg,
      }),

      subject: p.subject,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  static toSentPitchListFromPopulated(pitches: SentPitchPopulated[]): SentPitchListItemDTO[] {
    return pitches.map((p) => ({
      pitchId: p._id,
      projectId: p.projectId._id,
      projectName: p.projectId.startupName,

      ...(p.projectId.logoUrl && {
        projectLogoUrl: p.projectId.logoUrl,
      }),

      investorId: p.investorId._id,
      investorName: p.investorId.companyName,

      ...(p.investorId.profileImg && {
        investorProfileImg: p.investorId.profileImg,
      }),

      subject: p.subject,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  static toPitchDetailsDTO(pitch: PitchDetailsPopulated): PitchDetailsResponseDTO {
    return {
      pitchId: pitch._id,
      subject: pitch.subject,
      message: pitch.message,
      status: pitch.status,
      createdAt: pitch.createdAt.toISOString(),

      ...(pitch.investorReply && {
        investorReply: {
          message: pitch.investorReply.message,
          repliedAt: pitch.investorReply.repliedAt.toISOString(),
        },
      }),

      project: {
        id: pitch.projectId._id,
        name: pitch.projectId.startupName,
        ...(pitch.projectId.logoUrl && { logoUrl: pitch.projectId.logoUrl }),
      },

      founder: {
        id: pitch.founderId._id,
        name: pitch.founderId.userName,
        ...(pitch.founderId.profileImg && {
          profileImg: pitch.founderId.profileImg,
        }),
      },

      investor: {
        id: pitch.investorId._id,
        companyName: pitch.investorId.companyName,
        ...(pitch.investorId.profileImg && {
          profileImg: pitch.investorId.profileImg,
        }),
      },
    };
  }
}
