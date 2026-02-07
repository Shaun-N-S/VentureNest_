import mongoose from "mongoose";
import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";
import { IInvestmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { InvestmentOfferResponseDTO } from "application/dto/investor/investmentOfferDTO/investmentOfferResponseDTO";
import { CreateInvestmentOfferDTO } from "application/dto/investor/investmentOfferDTO/createInvestmentOfferDTO";
import { OfferStatus } from "@domain/enum/offerStatus";
import {
  InvestmentOfferDetailsPopulated,
  ReceivedInvestmentOfferPopulated,
  SentInvestmentOfferPopulated,
} from "application/dto/investor/investmentOfferDTO/investmentOfferPopulatedTypes";
import { SentInvestmentOfferListItemDTO } from "application/dto/investor/investmentOfferDTO/sentInvestmentOfferListItemDTO";
import { ReceivedInvestmentOfferListItemDTO } from "application/dto/investor/investmentOfferDTO/receivedInvestmentOfferListItemDTO";
import { InvestmentOfferDetailsResponseDTO } from "application/dto/investor/investmentOfferDTO/investmentOfferDetailsResponseDTO";
import { AcceptInvestmentOfferResponseDTO } from "application/dto/investor/investmentOfferDTO/acceptInvestmentOfferResponseDTO";

export class InvestmentOfferMapper {
  /* -------------------- DTO → Entity -------------------- */
  static toEntity(
    data: CreateInvestmentOfferDTO & {
      investorId: string;
      founderId: string;
      status: OfferStatus;
    }
  ): InvestmentOfferEntity {
    return {
      pitchId: data.pitchId,
      projectId: data.projectId,
      investorId: data.investorId,
      founderId: data.founderId,

      amount: data.amount,
      equityPercentage: data.equityPercentage,
      ...(data.valuation !== undefined && { valuation: data.valuation }),
      terms: data.terms,
      ...(data.note !== undefined && { note: data.note }),

      status: data.status,
      ...(data.expiresAt !== undefined && { expiresAt: data.expiresAt }),

      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /* -------------------- Entity → Mongo -------------------- */
  static toMongooseDocument(entity: InvestmentOfferEntity) {
    return {
      ...(entity._id && { _id: new mongoose.Types.ObjectId(entity._id) }),

      pitchId: new mongoose.Types.ObjectId(entity.pitchId),
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      investorId: new mongoose.Types.ObjectId(entity.investorId),
      founderId: new mongoose.Types.ObjectId(entity.founderId),

      amount: entity.amount,
      equityPercentage: entity.equityPercentage,
      ...(entity.valuation !== undefined && { valuation: entity.valuation }),
      terms: entity.terms,
      ...(entity.note !== undefined && { note: entity.note }),

      status: entity.status,
      ...(entity.expiresAt !== undefined && { expiresAt: entity.expiresAt }),
      ...(entity.respondedAt !== undefined && { respondedAt: entity.respondedAt }),
      ...(entity.respondedBy !== undefined && { respondedBy: entity.respondedBy }),
      ...(entity.rejectionReason !== undefined && {
        rejectionReason: entity.rejectionReason,
      }),

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /* -------------------- Mongo → Entity -------------------- */
  static fromMongooseDocument(doc: IInvestmentOfferModel): InvestmentOfferEntity {
    return {
      _id: doc._id.toString(),
      pitchId: doc.pitchId.toString(),
      projectId: doc.projectId.toString(),
      investorId: doc.investorId.toString(),
      founderId: doc.founderId.toString(),

      amount: doc.amount,
      equityPercentage: doc.equityPercentage,
      ...(doc.valuation !== undefined && { valuation: doc.valuation }),
      terms: doc.terms,
      ...(doc.note !== undefined && { note: doc.note }),

      status: doc.status,
      ...(doc.expiresAt !== undefined && { expiresAt: doc.expiresAt }),
      ...(doc.respondedAt !== undefined && { respondedAt: doc.respondedAt }),
      ...(doc.respondedBy !== undefined && { respondedBy: doc.respondedBy }),
      ...(doc.rejectionReason !== undefined && {
        rejectionReason: doc.rejectionReason,
      }),

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /* -------------------- Entity → Response DTO -------------------- */
  static toResponseDTO(entity: InvestmentOfferEntity): InvestmentOfferResponseDTO {
    return {
      offerId: entity._id!,
      pitchId: entity.pitchId,
      projectId: entity.projectId,
      investorId: entity.investorId,
      founderId: entity.founderId,

      amount: entity.amount,
      equityPercentage: entity.equityPercentage,
      ...(entity.valuation !== undefined && { valuation: entity.valuation }),
      terms: entity.terms,
      ...(entity.note !== undefined && { note: entity.note }),

      status: entity.status,
      ...(entity.expiresAt !== undefined && { expiresAt: entity.expiresAt }),

      createdAt: entity.createdAt!,
    };
  }

  static toSentOfferListDTO(
    offers: SentInvestmentOfferPopulated[]
  ): SentInvestmentOfferListItemDTO[] {
    return offers.map((o) => ({
      offerId: o._id,

      projectId: o.projectId._id,
      projectName: o.projectId.startupName,
      ...(o.projectId.logoUrl && { projectLogoUrl: o.projectId.logoUrl }),

      founderId: o.founderId._id,
      founderName: o.founderId.userName,
      ...(o.founderId.profileImg && {
        founderProfileImg: o.founderId.profileImg,
      }),

      amount: o.amount,
      equityPercentage: o.equityPercentage,
      ...(o.valuation !== undefined && { valuation: o.valuation }),

      status: o.status,
      createdAt: o.createdAt.toISOString(),
    }));
  }

  static toReceivedOfferListDTO(
    offers: ReceivedInvestmentOfferPopulated[]
  ): ReceivedInvestmentOfferListItemDTO[] {
    return offers.map((o) => ({
      offerId: o._id,

      projectId: o.projectId._id,
      projectName: o.projectId.startupName,
      ...(o.projectId.logoUrl && { projectLogoUrl: o.projectId.logoUrl }),

      investorId: o.investorId._id,
      investorName: o.investorId.companyName,
      ...(o.investorId.profileImg && {
        investorProfileImg: o.investorId.profileImg,
      }),

      amount: o.amount,
      equityPercentage: o.equityPercentage,
      ...(o.valuation !== undefined && { valuation: o.valuation }),

      status: o.status,
      createdAt: o.createdAt.toISOString(),
    }));
  }

  static toDetailsDTO(offer: InvestmentOfferDetailsPopulated): InvestmentOfferDetailsResponseDTO {
    return {
      offerId: offer._id,
      pitchId: offer.pitchId,

      amount: offer.amount,
      equityPercentage: offer.equityPercentage,
      ...(offer.valuation !== undefined && { valuation: offer.valuation }),

      terms: offer.terms,
      ...(offer.note !== undefined && { note: offer.note }),

      status: offer.status,
      ...(offer.expiresAt && { expiresAt: offer.expiresAt }),
      ...(offer.respondedAt && { respondedAt: offer.respondedAt }),
      ...(offer.rejectionReason && {
        rejectionReason: offer.rejectionReason,
      }),

      createdAt: offer.createdAt.toISOString(),

      project: {
        id: offer.projectId._id,
        name: offer.projectId.startupName,
        ...(offer.projectId.logoUrl && { logoUrl: offer.projectId.logoUrl }),
      },

      investor: {
        id: offer.investorId._id,
        name: offer.investorId.companyName,
        ...(offer.investorId.profileImg && {
          profileImg: offer.investorId.profileImg,
        }),
      },

      founder: {
        id: offer.founderId._id,
        name: offer.founderId.userName,
        ...(offer.founderId.profileImg && {
          profileImg: offer.founderId.profileImg,
        }),
      },
    };
  }

  static toAcceptResponseDTO(entity: InvestmentOfferEntity): AcceptInvestmentOfferResponseDTO {
    return {
      offerId: entity._id!,
      status: entity.status,
      respondedAt: entity.respondedAt!,
    };
  }
}
