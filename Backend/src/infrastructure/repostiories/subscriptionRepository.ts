import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { SubscriptionEntity } from "@domain/entities/subscription/subscriptionEntity";
import { ISubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { SubscriptionMapper } from "application/mappers/subscriptionMapper";
import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";
import { UserRole } from "@domain/enum/userRole";

export class SubscriptionRepository
  extends BaseRepository<SubscriptionEntity, ISubscriptionModel>
  implements ISubscriptionRepository
{
  constructor(protected _model: Model<ISubscriptionModel>) {
    super(_model, SubscriptionMapper);
  }

  async findActiveByOwner(
    ownerId: string,
    ownerRole: UserRole
  ): Promise<SubscriptionEntity | null> {
    const doc = await this._model.findOne({
      ownerId,
      ownerRole,
      status: SubscriptionStatus.ACTIVE,
      expiresAt: { $gt: new Date() },
    });

    return doc ? SubscriptionMapper.fromMongooseDocument(doc) : null;
  }

  async findLatestByOwner(
    ownerId: string,
    ownerRole: UserRole
  ): Promise<SubscriptionEntity | null> {
    const doc = await this._model.findOne({ ownerId, ownerRole }).sort({ createdAt: -1 });

    return doc ? SubscriptionMapper.fromMongooseDocument(doc) : null;
  }

  async cancelSubscription(
    ownerId: string,
    ownerRole: UserRole
  ): Promise<SubscriptionEntity | null> {
    const updated = await this._model.findOneAndUpdate(
      { ownerId, ownerRole, status: SubscriptionStatus.ACTIVE },
      { status: SubscriptionStatus.CANCELLED },
      { new: true }
    );

    return updated ? SubscriptionMapper.fromMongooseDocument(updated) : null;
  }

  async expireSubscription(
    ownerId: string,
    ownerRole: UserRole
  ): Promise<SubscriptionEntity | null> {
    const updated = await this._model.findOneAndUpdate(
      {
        ownerId,
        ownerRole,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { $lte: new Date() },
      },
      { status: SubscriptionStatus.EXPIRED },
      { new: true }
    );

    return updated ? SubscriptionMapper.fromMongooseDocument(updated) : null;
  }
}
