import { Request, Response, NextFunction } from "express";
import { IRegisterProjectUseCase } from "@domain/interfaces/useCases/project/IRegisterProjectUseCase";
import { CreateProjectRegistrationDTO } from "application/dto/project/projectRegistrationDTO";
import { CreateProjectRegistrationReqSchema } from "@shared/validations/CreateProjectRegistrationReqSchema";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { MESSAGES } from "@shared/constants/messages";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { multerFileToFileConverter } from "@shared/utils/fileConverter";
import { MulterFiles } from "@domain/types/multerFilesType";

export class ProjectRegistrationController {
  constructor(private _createProjectRegistrationUseCase: IRegisterProjectUseCase) {}

  async registerProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals?.user?.userId;
      const projectId = req.params.projectId;
      const files = req.files as MulterFiles<"gstCertificate" | "companyRegistrationCertificate">;

      if (!userId || !projectId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const formData = req.body;

      const rawData = {
        ...formData,

        project_id: projectId,
        founder_id: userId,

        gstCertificate: files?.gstCertificate?.[0]
          ? multerFileToFileConverter(files.gstCertificate[0])
          : undefined,

        companyRegistrationCertificate: files?.companyRegistrationCertificate?.[0]
          ? multerFileToFileConverter(files.companyRegistrationCertificate[0])
          : undefined,

        // Convert boolean strings → boolean
        verifyProfile: formData.verifyProfile === "true" || formData.verifyProfile === true,

        declarationAccepted:
          formData.declarationAccepted === "true" || formData.declarationAccepted === true,
      };

      const validated = CreateProjectRegistrationReqSchema.safeParse(rawData);
      if (!validated.success) {
        console.log(validated.error);
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const dto: CreateProjectRegistrationDTO = validated.data;

      await this._createProjectRegistrationUseCase.registerProject(dto);

      ResponseHelper.success(res, MESSAGES.PROJECT.PROJECT_REGISTRATION_SUCCESSFULL, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
