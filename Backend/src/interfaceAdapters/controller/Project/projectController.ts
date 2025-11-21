import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { MulterFiles } from "@domain/types/multerFilesType";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { multerFileToFileConverter } from "@shared/utils/fileConverter";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { CreateProjectReqSchema } from "@shared/validations/createProjectValidator";
import { InvalidDataException } from "application/constants/exceptions";
import { CreateProjectDTO } from "application/dto/project/projectDTO";
import { NextFunction, Request, Response } from "express";

export class ProjectController {
  constructor(private _projectRepository: IProjectRepository) {}

  async addProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formData = req.body?.formData ? JSON.parse(req.body.formData) : null;
      const files = req.files as MulterFiles<"pitchDeckUrl" | "logoUrl" | "coverImageUrl">;

      const data: CreateProjectDTO = { ...formData };

      if (files["pitchDeckUrl"]?.[0]) {
        data.pitchDeckUrl = multerFileToFileConverter(files["pitchDeckUrl"][0]);
      }

      if (files["logoUrl"]?.[0]) {
        data.logoUrl = multerFileToFileConverter(files["logoUrl"][0]);
      }

      if (files["coverImageUrl"]?.[0]) {
        data.coverImageUrl = multerFileToFileConverter(files["coverImageUrl"][0]);
      }

      const validatedData = CreateProjectReqSchema.safeParse(data);

      if (validatedData.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      // const result = await this.

      // ResponseHelper.success(res, MESSAGES, { data: result }, HTTPSTATUS.OK)
    } catch (error) {
      next(error);
    }
  }
}
