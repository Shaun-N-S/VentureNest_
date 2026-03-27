import { Router, Request, Response, NextFunction } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { ROUTES } from "@shared/constants/routes";
import { dealController } from "@infrastructure/DI/Deal/dealContainer";

export class Deal_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.get(
      ROUTES.DEAL.MY,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dealController.getMyDeals(req, res, next);
      }
    );

    this._route.get(
      ROUTES.DEAL.GET_BY_ID,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        dealController.getDealDetails(req, res, next)
    );

    this._route.get(
      ROUTES.DEAL.GET_INSTALLMENTS,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dealController.getDealInstallments(req, res, next);
      }
    );

    this._route.post(
      ROUTES.DEAL.INSTALLMENT_CHECKOUT,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dealController.createInstallmentCheckout(req, res, next);
      }
    );

    this._route.post(
      ROUTES.DEAL.RELEASE_INSTALLMENT,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        dealController.releaseInstallment(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
