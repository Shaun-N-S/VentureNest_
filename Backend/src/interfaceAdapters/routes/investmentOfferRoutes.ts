import { Router, Request, Response, NextFunction } from "express";
import { ROUTES } from "@shared/constants/routes";
import { investorGuard, userGuard, userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { investmentOfferController } from "@infrastructure/DI/Investor/InvestmentOfferContainer";

export class InvestmentOffer_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.post(
      ROUTES.OFFER.CREATE,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        investmentOfferController.createOffer(req, res, next)
    );

    this._route.get(
      ROUTES.OFFER.SENT,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        investmentOfferController.getSentOffers(req, res, next)
    );

    this._route.get(
      ROUTES.OFFER.RECEIVED,
      ...userGuard,
      (req: Request, res: Response, next: NextFunction) => {
        investmentOfferController.getReceivedOffers(req, res, next);
      }
    );

    this._route.get(
      ROUTES.OFFER.GET_BY_ID,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        investmentOfferController.getOfferDetails(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.OFFER.ACCEPT,
      ...userGuard,
      (req: Request, res: Response, next: NextFunction) =>
        investmentOfferController.acceptOffer(req, res, next)
    );

    this._route.patch(
      ROUTES.OFFER.REJECT,
      ...userGuard,
      (req: Request, res: Response, next: NextFunction) => {
        investmentOfferController.rejectOffer(req, res, next);
      }
    );
  }

  get_router(): Router {
    return this._route;
  }
}
