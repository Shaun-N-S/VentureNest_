import { adminInvestorController } from "@infrastructure/DI/Admin/adminInvestorContainer";
import { adminUserController } from "@infrastructure/DI/Admin/adminUserContainer";
import { adminAuthController } from "@infrastructure/DI/Auth/authContainer";
import { Request, Response, Router } from "express";

export class Admin_Routes {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post("/admin/login", (req: Request, res: Response) => {
      adminAuthController.adminLogin(req, res);
    });

    this._route.get("/users", (req: Request, res: Response) => {
      adminUserController.getAllUsers(req, res);
    });

    this._route.get("/investors", (req: Request, res: Response) => {
      adminInvestorController.getAllInvestor(req, res);
    });

    this._route.post("/users/update-status", (req: Request, res: Response) => {
      adminUserController.updateUserStatus(req, res);
    });

    this._route.post("/investors/update-status", (req: Request, res: Response) => {
      adminInvestorController.updateInvestorStatus(req, res);
    });
  }

  public get_router(): Router {
    return this._route;
  }
}
