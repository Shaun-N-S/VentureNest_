import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { ISubscriptionRepository } from "@domain/interfaces/repositories/ISubscriptionRepository";
import { SubscriptionEntity } from "@domain/entities/subscription/subscriptionEntity";
import { ISubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { SubscriptionMapper } from "application/mappers/subscriptionMapper";
import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";

export class SubscriptionRepository
  extends BaseRepository<SubscriptionEntity, ISubscriptionModel>
  implements ISubscriptionRepository
{
  constructor(protected _model: Model<ISubscriptionModel>) {
    super(_model, SubscriptionMapper);
  }

  /**
   * Get active subscription of a user
   * Used in guards & subscription checks
   */
  async findActiveByUserId(userId: string): Promise<SubscriptionEntity | null> {
    const doc = await this._model.findOne({
      userId,
      status: SubscriptionStatus.ACTIVE,
    });

    return doc ? SubscriptionMapper.fromMongooseDocument(doc) : null;
  }

  /**
   * Cancel user's active subscription
   * Soft cancel (status change)
   */
  async cancelSubscription(userId: string): Promise<SubscriptionEntity | null> {
    const updated = await this._model.findOneAndUpdate(
      {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      {
        status: SubscriptionStatus.CANCELLED,
      },
      { new: true }
    );

    return updated ? SubscriptionMapper.fromMongooseDocument(updated) : null;
  }
}
