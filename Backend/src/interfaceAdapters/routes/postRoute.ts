import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";

export class Post_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(ROUTES.POST.ADD, (req: Request, res: Response, next: NextFunction) => {});
  }

  public get_router(): Router {
    return this._route;
  }
}
