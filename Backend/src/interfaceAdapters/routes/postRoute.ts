import { postController } from "@infrastructure/DI/Post/PostContainer";
import { ROUTES } from "@shared/constants/routes";
import { NextFunction, Request, Response, Router } from "express";
import { uploadMulter } from "interfaceAdapters/middleware/multer";

export class Post_Router {
  private _route: Router;

  constructor() {
    this._route = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._route.post(
      ROUTES.POST.ADD,
      uploadMulter.fields([{ name: "mediaUrls", maxCount: 3 }]),
      (req: Request, res: Response, next: NextFunction) => {
        postController.addPost(req, res, next);
      }
    );
  }

  public get_router(): Router {
    return this._route;
  }
}
