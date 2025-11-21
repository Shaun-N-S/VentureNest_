import { postController } from "@infrastructure/DI/Post/PostContainer";
import { ROUTES } from "../../shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { uploadMulter } from "interfaceAdapters/middleware/multer";
import { authMiddleware } from "@infrastructure/DI/Auth/authContainer";

export class Post_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(
      ROUTES.POST.ADD,
      authMiddleware.verify,
      uploadMulter.fields([{ name: "mediaUrls", maxCount: 3 }]),
      (req: Request, res: Response, next: NextFunction) => {
        postController.addPost(req, res, next);
      }
    );

    this._route.get(
      ROUTES.POST.PERSONAL_POST,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        postController.fetchPersonalPosts(req, res, next);
      }
    );

    this._route.get(
      ROUTES.POST.FEED,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        postController.fetchAllPosts(req, res, next);
      }
    );

    this._route.patch(
      ROUTES.POST.REMOVE,
      authMiddleware.verify,
      (req: Request, res: Response, next: NextFunction) => {
        postController.removePost(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
