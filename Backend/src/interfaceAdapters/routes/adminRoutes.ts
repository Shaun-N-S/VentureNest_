import { adminInvestorController } from "@infrastructure/DI/Admin/adminInvestorContainer";
import { adminUserController } from "@infrastructure/DI/Admin/adminUserContainer";
import { adminAuthController } from "@infrastructure/DI/Auth/authContainer";
import { ROUTES } from "@shared/constants/routes";
import { Request, Response, Router } from "express";

export class Admin_Routes {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    const ADMIN = ROUTES.ADMIN;

    const ADMIN_AUTH = ROUTES.AUTH.ADMIN;

    this._route.post(ADMIN_AUTH.LOGIN, (req: Request, res: Response) =>
      adminAuthController.adminLogin(req, res)
    );

    this._route.get(ADMIN.USERS, (req: Request, res: Response) =>
      adminUserController.getAllUsers(req, res)
    );

    this._route.post(ADMIN.UPDATE_USER_STATUS, (req: Request, res: Response) =>
      adminUserController.updateUserStatus(req, res)
    );

    this._route.get(ADMIN.INVESTORS, (req: Request, res: Response) =>
      adminInvestorController.getAllInvestor(req, res)
    );

    this._route.post(ADMIN.UPDATE_INVESTOR_STATUS, (req: Request, res: Response) =>
      adminInvestorController.updateInvestorStatus(req, res)
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
