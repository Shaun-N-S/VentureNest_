import { Request, Response, NextFunction } from "express";
import { IGetNotificationsUseCase } from "@domain/interfaces/useCases/notification/IGetNotificationsUseCase";
import { IMarkNotificationReadUseCase } from "@domain/interfaces/useCases/notification/IMarkNotificationReadUseCase";
import { IMarkAllNotificationsReadUseCase } from "@domain/interfaces/useCases/notification/IMarkAllNotificationsReadUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { MESSAGES } from "@shared/constants/messages";
import { IGetUnreadNotificationCountUseCase } from "@domain/interfaces/useCases/notification/IGetUnreadNotificationCountUseCase";

export class NotificationController {
  constructor(
    private _getNotificationsUseCase: IGetNotificationsUseCase,
    private _markNotificationReadUseCase: IMarkNotificationReadUseCase,
    private _markAllNotificationsReadUseCase: IMarkAllNotificationsReadUseCase,
    private _getUnreadCountUseCase: IGetUnreadNotificationCountUseCase
  ) {}

  async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.user;
      const { page = 1, limit = 10 } = req.query;

      if (!userId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const skip = (Number(page) - 1) * Number(limit);

      const notifications = await this._getNotificationsUseCase.getNotifications({
        userId,
        skip,
        limit: Number(limit),
      });

      const unreadCount = await this._getUnreadCountUseCase.execute(userId);

      ResponseHelper.success(
        res,
        MESSAGES.NOTIFICATION.NOTIFICATIONS_FETCHED,
        { notifications, unreadCount },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._markNotificationReadUseCase.markAsRead(id);

      ResponseHelper.success(
        res,
        MESSAGES.NOTIFICATION.NOTIFICATION_MARKED_READ,
        null,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async markAllNotificationsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.user;

      if (!userId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._markAllNotificationsReadUseCase.markAll(userId);

      ResponseHelper.success(res, MESSAGES.NOTIFICATION.ALL_MARKED_READ, null, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
