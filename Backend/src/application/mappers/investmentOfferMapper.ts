import mongoose from "mongoose";
import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";
import { IInvestmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { InvestmentOfferResponseDTO } from "application/dto/investor/investmentOfferDTO/investmentOfferResponseDTO";
import { CreateInvestmentOfferDTO } from "application/dto/investor/investmentOfferDTO/createInvestmentOfferDTO";
import { OfferStatus } from "@domain/enum/offerStatus";

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
}
