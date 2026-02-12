import { NotificationEntity } from "@domain/entities/notification/notificationEntity";
import { BaseRepository } from "./baseRepository";
import { INotificationRepository } from "@domain/interfaces/repositories/INotificationRepository";
import { INotificationModel } from "@infrastructure/db/models/notificationModel";
import { NotificationMapper } from "application/mappers/notificationMapper";
import mongoose, { Model } from "mongoose";

export class NotificationRepository
  extends BaseRepository<NotificationEntity, INotificationModel>
  implements INotificationRepository
{
  constructor(protected _model: Model<INotificationModel>) {
    super(_model, NotificationMapper);
  }

  async findByRecipient(
    recipientId: string,
    skip: number,
    limit: number
  ): Promise<NotificationEntity[]> {
    const docs = await this._model
      .find({
        recipientId: new mongoose.Types.ObjectId(recipientId),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "actorId",
        select: "userName companyName profileImg",
      });

    return docs.map((doc) => NotificationMapper.fromMongooseDocument(doc));
  }

  async countUnread(recipientId: string): Promise<number> {
    return this._model.countDocuments({
      recipientId: new mongoose.Types.ObjectId(recipientId),
      isRead: false,
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this._model.updateOne({ _id: notificationId }, { $set: { isRead: true } });
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await this._model.updateMany(
      { recipientId: new mongoose.Types.ObjectId(recipientId), isRead: false },
      { $set: { isRead: true } }
    );
  }
}
