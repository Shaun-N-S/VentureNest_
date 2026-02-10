import { Router, Request, Response, NextFunction } from "express";
import { transactionController } from "@infrastructure/DI/Transaction/transactionContainer";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";
import { ROUTES } from "@shared/constants/routes";

export class Transaction_Routes {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    // 🔹 Get personal wallet transactions (with optional action filter)
    this._route.get(
      ROUTES.TRANSACTION.MY_WALLET,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        transactionController.getMyWalletTransactions(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
