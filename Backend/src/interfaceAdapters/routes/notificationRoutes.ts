import { Router, Request, Response, NextFunction } from "express";
import { notificationController } from "@infrastructure/DI/Notification/notificationContainer";
import { ROUTES } from "@shared/constants/routes";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";

export class Notification_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.get(
      ROUTES.NOTIFICATION.ME,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        notificationController.getMyNotifications(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.NOTIFICATION.MARK_READ,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        notificationController.markNotificationAsRead(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.NOTIFICATION.MARK_ALL_READ,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        notificationController.markAllNotificationsRead(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
