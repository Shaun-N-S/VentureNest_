import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { Errors } from "@shared/constants/error";
import { InvalidDataException } from "application/constants/exceptions";
import { IGetAllProjectRegistrationsUseCase } from "@domain/interfaces/useCases/admin/project/IGetAllProjectRegistrationsUseCase";
import { IUpdateProjectRegistrationStatusUseCase } from "@domain/interfaces/useCases/admin/project/IUpdateProjectRegistrationStatusUseCase";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { MESSAGES } from "@shared/constants/messages";

export class AdminProjectRegistrationController {
  constructor(
    private _getAllUseCase: IGetAllProjectRegistrationsUseCase,
    private _updateStatusUseCase: IUpdateProjectRegistrationStatusUseCase
  ) {}

  async getAllProjectRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      let enumStatus: ProjectRegistrationStatus | undefined;

      if (req.query.status) {
        if (
          Object.values(ProjectRegistrationStatus).includes(
            req.query.status as ProjectRegistrationStatus
          )
        ) {
          enumStatus = req.query.status as ProjectRegistrationStatus;
        } else {
          throw new InvalidDataException(Errors.INVALID_DATA);
        }
      }

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllUseCase.execute(page, limit, enumStatus);

      ResponseHelper.success(
        res,
        MESSAGES.PROJECT_REGISTRATION.GET_ALL_PROJECT_REGISTRATIONS,
        { result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProjectRegistrationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const registrationId = req.params.registrationId;
      const { status, reason } = req.body;

      if (!registrationId || !status) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      if (!Object.values(ProjectRegistrationStatus).includes(status as ProjectRegistrationStatus)) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const enumStatus = status as ProjectRegistrationStatus;

      if (enumStatus === ProjectRegistrationStatus.REJECTED && (!reason || reason.trim() === "")) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._updateStatusUseCase.execute(registrationId, enumStatus, reason);

      ResponseHelper.success(
        res,
        MESSAGES.PROJECT_REGISTRATION.STATUS_UPDATE_SUCCESSFUL,
        { data: result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
