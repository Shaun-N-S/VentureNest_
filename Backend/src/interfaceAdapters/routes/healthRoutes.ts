import { Router, Request, Response } from "express";
import { healthController } from "interfaceAdapters/controller/Health/healthController";

export class Health_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.get("/", (req: Request, res: Response) => {
      healthController.getHealth(req, res);
    });
  }

  public get_router(): Router {
    return this._route;
  }
}
