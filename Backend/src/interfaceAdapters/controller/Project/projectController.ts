import { ICreateProjectUseCase } from "@domain/interfaces/useCases/project/ICreateProjectUseCase";
import { IFetchPersonalProjectsUseCase } from "@domain/interfaces/useCases/project/IFetchPersonalProjectsUseCase";
import { IFetchAllProjectsUseCase } from "@domain/interfaces/useCases/project/IFetchAllProjectsUseCase";
import { IRemoveProjectUseCase } from "@domain/interfaces/useCases/project/IRemoveProjectsUseCase";
import { MulterFiles } from "@domain/types/multerFilesType";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { multerFileToFileConverter } from "@shared/utils/fileConverter";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { CreateProjectReqSchema } from "@shared/validations/createProjectValidator";
import { InvalidDataException } from "application/constants/exceptions";
import { CreateProjectDTO } from "application/dto/project/projectDTO";
import { Request, Response, NextFunction } from "express";
import { IFetchProjectByIdUseCase } from "@domain/interfaces/useCases/project/IFetchProjectByIdUseCase";

export class ProjectController {
  constructor(
    private _createProject: ICreateProjectUseCase,
    private _fetchPersonalProjects: IFetchPersonalProjectsUseCase,
    private _fetchAllProjects: IFetchAllProjectsUseCase,
    private _removeProject: IRemoveProjectUseCase,
    private _fetchProjectById: IFetchProjectByIdUseCase
  ) {}

  async addProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formData = req.body;
      const userId = res.locals?.user?.userId;
      const files = req.files as MulterFiles<"pitchDeckUrl" | "logoUrl" | "coverImageUrl">;

      const rawData = {
        ...formData,
        userId,

        pitchDeckUrl: files?.pitchDeckUrl?.[0]
          ? multerFileToFileConverter(files.pitchDeckUrl[0])
          : undefined,

        logoUrl: files?.logoUrl?.[0] ? multerFileToFileConverter(files.logoUrl[0]) : undefined,

        coverImageUrl: files?.coverImageUrl?.[0]
          ? multerFileToFileConverter(files.coverImageUrl[0])
          : undefined,
      };

      const validated = CreateProjectReqSchema.safeParse(rawData);

      if (!validated.success) {
        console.log(validated.error);
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const dto: CreateProjectDTO = validated.data;

      await this._createProject.createProject(dto);

      ResponseHelper.success(res, MESSAGES.PROJECT.PROJECT_CREATED_SUCCESSFULLY, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async fetchPersonalProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals?.user?.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (!userId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._fetchPersonalProjects.fetchPersonalProjects(userId, page, limit);

      ResponseHelper.success(res, MESSAGES.PROJECT.PROJECT_FETCH_SUCCESS, { data }, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async fetchAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const data = await this._fetchAllProjects.fetchAllProjects(page, limit);

      ResponseHelper.success(res, MESSAGES.PROJECT.PROJECT_FETCH_SUCCESS, { data }, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async removeProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.params.id!;
      const userId = res.locals?.user?.userId;

      await this._removeProject.removeProject(projectId, userId);

      ResponseHelper.success(res, MESSAGES.PROJECT.PROJECT_REMOVED_SUCCESSFULLY, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async findProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.params.projectId;

      if (!projectId) throw new InvalidDataException(Errors.INVALID_DATA);

      const project = await this._fetchProjectById.fetchProjectById(projectId);

      ResponseHelper.success(
        res,
        MESSAGES.PROJECT.PROJECT_FETCH_SUCCESS,
        { project },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
