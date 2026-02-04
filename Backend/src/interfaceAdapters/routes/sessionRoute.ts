import { sessionController } from "@infrastructure/DI/Session/sessionContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";

export class Session_Router {
  private _route: Router;
  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.patch(
      ROUTES.SESSION.CANCEL_SESSOIN,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        sessionController.cancelSession(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
