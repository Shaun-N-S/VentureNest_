import { pitchController } from "@infrastructure/DI/Pitch/pitchContainer";
import { ROUTES } from "@shared/constants/routes";
import { Router, Request, Response, NextFunction } from "express";
import { investorGuard, userGuard } from "interfaceAdapters/middleware/guards";

export class Pitch_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(
      ROUTES.PITCH.CREATE,
      ...userGuard,
      (req: Request, res: Response, next: NextFunction) => {
        pitchController.createPitch(req, res, next);
      }
    );

    this._route.get(
      ROUTES.PITCH.RECEIVED,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        pitchController.getReceivedPitches(req, res, next)
    );

    this._route.get(
      ROUTES.PITCH.SENT,
      ...userGuard,
      (req: Request, res: Response, next: NextFunction) => {
        pitchController.getSentPitches(req, res, next);
      }
    );

    this._route.get(
      ROUTES.PITCH.GET_BY_ID,
      ...userGuard,
      (req: Request, res: Response, next: NextFunction) => {
        pitchController.getPitchDetails(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.PITCH.RESPOND,
      ...investorGuard,
      (req: Request, res: Response, next: NextFunction) =>
        pitchController.respondToPitch(req, res, next)
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
