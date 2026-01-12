import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { IGetPostByIdUseCase } from "@domain/interfaces/useCases/admin/post/IGetPostByIdUseCase";
import { IGetProjectByIdUseCase } from "@domain/interfaces/useCases/admin/project/IGetProjectByIdUseCase";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";

export class AdminContentController {
  constructor(
    private _getPostByIdUseCase: IGetPostByIdUseCase,
    private _getProjectByIdUseCase: IGetProjectByIdUseCase
  ) {}

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.postId;

      if (!postId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._getPostByIdUseCase.execute(postId);

      ResponseHelper.success(res, "Post fetched", data, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }

  async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId;

      if (!projectId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._getProjectByIdUseCase.execute(projectId);

      ResponseHelper.success(res, "Project fetched", data, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }
}
