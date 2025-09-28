import { userAuthController } from "@infrastructure/DI/Auth/authContainer";
import { Request, Response, Router } from "express";

export class User_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post("/users", (req: Request, res: Response) => {
      userAuthController.sendOtp(req, res);
    });

    this._route.post("/users/verify-otp", (req: Request, res: Response) => {
      userAuthController.registerUser(req, res);
    });
  }

  public get_router(): Router {
    return this._route;
  }
}
