import mongoose from "mongoose";
import { ITransactionModel } from "@infrastructure/db/models/transactionModel";
import { TransactionDTO } from "application/dto/transaction/transactionDTO";
import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";

export class TransactionMapper {
  static toMongooseDocument(entity: TransactionEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      fromWalletId: entity.fromWalletId
        ? new mongoose.Types.ObjectId(entity.fromWalletId)
        : undefined,
      toWalletId: entity.toWalletId ? new mongoose.Types.ObjectId(entity.toWalletId) : undefined,
      relatedDealId: entity.relatedDealId,
      relatedPaymentId: entity.relatedPaymentId,
      amount: entity.amount,
      action: entity.action,
      reason: entity.reason,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: ITransactionModel): TransactionEntity {
    const entity: TransactionEntity = {
      _id: doc._id.toString(),
      amount: doc.amount,
      action: doc.action,
      reason: doc.reason,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    if (doc.fromWalletId) {
      entity.fromWalletId = doc.fromWalletId.toString();
    }
    if (doc.toWalletId) {
      entity.toWalletId = doc.toWalletId.toString();
    }
    if (doc.relatedDealId) {
      entity.relatedDealId = doc.relatedDealId.toString();
    }
    if (doc.relatedPaymentId) {
      entity.relatedPaymentId = doc.relatedPaymentId.toString();
    }
    return entity;
  }

  static toDTO(entity: TransactionEntity): TransactionDTO {
    const dto: TransactionDTO = {
      _id: entity._id!,
      amount: entity.amount,
      action: entity.action,
      reason: entity.reason,
      status: entity.status,
      createdAt: entity.createdAt!,
    };
    if (entity.fromWalletId) {
      dto.fromWalletId = entity.fromWalletId;
    }
    if (entity.toWalletId) {
      dto.toWalletId = entity.toWalletId;
    }

    return dto;
  }
}
