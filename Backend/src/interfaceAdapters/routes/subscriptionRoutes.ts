import { Router, Request, Response, NextFunction } from "express";
import { ROUTES } from "@shared/constants/routes";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { subscriptionController } from "@infrastructure/DI/Subscription/subscriptionContainer";

export class Subscription_Routes {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.post(
      ROUTES.SUBSCRIPTION.CHECKOUT,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.createCheckout(req, res, next);
      }
    );

    this._route.get(
      ROUTES.SUBSCRIPTION.CURRENT,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.getCurrentSubscription(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
