import { planController } from "@infrastructure/DI/Plan/PlanContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";

export class Plan_Routes {
  private _route: Router;
  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.get(
      ROUTES.PLANS.AVAILABLE_PLANS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        planController.getAvailablePlans(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
