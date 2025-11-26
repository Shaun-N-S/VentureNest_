import { authMiddleware } from "@infrastructure/DI/Auth/authContainer";
import { commentController } from "@infrastructure/DI/comment/commentContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";

export class Comment_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(
      ROUTES.COMMENT.ADD_COMMENT,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        commentController.addComment(req, res, next);
      }
    );

    this._route.get(
      ROUTES.COMMENT.FETCH_COMMENTS,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        commentController.getComments(req, res, next);
      }
    );

    this._route.post(
      ROUTES.COMMENT.LIKE_COMMENT,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        commentController.likeComment(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
