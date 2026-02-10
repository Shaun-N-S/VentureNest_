import { userAuthController } from "@infrastructure/DI/Auth/authContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";

export class Auth_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    // USER
    // INVESTOR
  }

  get_router() {
    return this._route;
  }
}
