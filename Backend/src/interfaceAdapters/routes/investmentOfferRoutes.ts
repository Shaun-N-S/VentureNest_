import { Router, Request, Response, NextFunction } from "express";
import { ROUTES } from "@shared/constants/routes";
import { investorGuard } from "interfaceAdapters/middleware/guards";
import { investmentOfferController } from "@infrastructure/DI/Investor/InvestmentOfferContainer";

export class InvestmentOffer_Router {
  private readonly _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      ROUTES.OFFER.CREATE,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        investmentOfferController.createOffer(req, res, next)
    );
  }

  get_router(): Router {
    return this._router;
  }
}
