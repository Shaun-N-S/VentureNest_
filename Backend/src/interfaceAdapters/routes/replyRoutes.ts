import { replyController } from "@infrastructure/DI/Reply/replyContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { userOrInvestorGuard } from "interfaceAdapters/middleware/guards";

export class Reply_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(
      ROUTES.REPLIES.ADD_REPLIES,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        replyController.addReply(req, res, next);
      }
    );

    this._route.get(
      ROUTES.REPLIES.FETCH_REPLIES,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        replyController.getReplies(req, res, next);
      }
    );

    this._route.post(
      ROUTES.REPLIES.LIKE_REPLIES,
      ...userOrInvestorGuard,
      (req: Request, res: Response, next: NextFunction) => {
        replyController.likeReply(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
