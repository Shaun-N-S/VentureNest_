import { reportController } from "@infrastructure/DI/Report/reportContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";

export class Report_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(
      ROUTES.REPORTS.CREATE,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        reportController.createReport(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
