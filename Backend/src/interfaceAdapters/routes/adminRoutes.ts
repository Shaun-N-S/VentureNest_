import { adminInvestorController } from "@infrastructure/DI/Admin/adminInvestorContainer";
import { adminUserController } from "@infrastructure/DI/Admin/adminUserContainer";
import { adminAuthController, authMiddleware } from "@infrastructure/DI/Auth/authContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";

export class Admin_Routes {
  private _route: Router;
  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    const ADMIN = ROUTES.ADMIN;

    const ADMIN_AUTH = ROUTES.AUTH.ADMIN;

    this._route.post(ADMIN_AUTH.LOGIN, (req: Request, res: Response, next: NextFunction) =>
      adminAuthController.adminLogin(req, res, next)
    );

    this._route.get(
      ADMIN.USERS,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) =>
        adminUserController.getAllUsers(req, res, next)
    );

    this._route.post(
      ADMIN.UPDATE_USER_STATUS,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) =>
        adminUserController.updateUserStatus(req, res, next)
    );

    this._route.get(
      ADMIN.INVESTORS,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) =>
        adminInvestorController.getAllInvestor(req, res, next)
    );

    this._route.post(
      ADMIN.UPDATE_INVESTOR_STATUS,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) =>
        adminInvestorController.updateInvestorStatus(req, res, next)
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
