import { Router, Request, Response, NextFunction } from "express";
import { ROUTES } from "@shared/constants/routes";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { paymentController } from "@infrastructure/DI/Payment/paymentContainer";

export class Payment_Routes {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.get(
      ROUTES.PAYMENT.SESSION_SUMMARY,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        paymentController.getSessionSummary(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
