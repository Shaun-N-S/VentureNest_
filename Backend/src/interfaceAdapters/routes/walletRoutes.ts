import { walletController } from "@infrastructure/DI/Wallet/walletContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";

export class Wallet_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.get(
      ROUTES.WALLET.ME,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        walletController.getMyWallet(req, res, next);
      }
    );

    this._route.get(
      ROUTES.WALLET.PROJECT,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        walletController.getProjectWallet(req, res, next);
      }
    );

    this._route.post(
      ROUTES.WALLET.TOPUP_CHECKOUT,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        walletController.createWalletTopupCheckout(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
