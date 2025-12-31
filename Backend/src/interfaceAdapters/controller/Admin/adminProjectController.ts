import { IGetAllProjectsUseCase } from "@domain/interfaces/useCases/admin/project/IGetAlllProjectUseCase";
import { IUpdateProjectStatusUseCase } from "@domain/interfaces/useCases/admin/project/IUpdateProjectStatusUseCase";
import { Errors, PROJECT_ERRORS } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class AdminProjectController {
  constructor(
    private _getAllProjectsUseCase: IGetAllProjectsUseCase,
    private _updateProjectStatusUseCase: IUpdateProjectStatusUseCase
  ) {}

  async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const stage = req.query.stage as string | undefined;
      const sector = req.query.sector as string | undefined;
      const search = req.query.search as string | undefined;
      console.log("Received parameters:", { page, limit, status, stage, sector, search });
      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllProjectsUseCase.getAllProjects(
        page,
        limit,
        status,
        stage,
        sector,
        search
      );

      console.log("Result in controller:", result);

      if (!result || result.projects.length === 0) {
        throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
      }

      ResponseHelper.success(
        res,
        MESSAGES.PROJECT.GET_ALL_PROJECTS,
        { data: result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      console.log("Error in getAllProjects:", error);
      next(error);
    }
  }

  async updateProjectStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId, currentStatus } = req.body;
      console.log(projectId, currentStatus);

      if (!projectId || !currentStatus) {
        throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
      }

      const result = await this._updateProjectStatusUseCase.updateProjectStatus(
        projectId,
        currentStatus
      );

      ResponseHelper.success(
        res,
        MESSAGES.PROJECT.STATUS_UPDATED_SUCCESSFULLY,
        { data: result.project },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
