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

    this._route.get("/users", (req: Request, res: Response) => {});
  }

  public get_router(): Router {
    return this._route;
  }
}
