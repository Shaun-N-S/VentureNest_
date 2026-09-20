import { Router, Request, Response } from "express";
import { metricsController } from "interfaceAdapters/controller/Metrics/metricsController";

export class Metrics_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._route.get("/", (req: Request, res: Response) => {
      metricsController.getMetrics(req, res);
    });
  }

  public get_router(): Router {
    return this._route;
  }
}
