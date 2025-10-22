import { IGetAllUsersUseCase } from "@domain/interfaces/useCases/admin/user/IGetAllUsersUseCase";
import { IUpdateUserStatusUseCase } from "@domain/interfaces/useCases/admin/user/IUpdateUserStatusUseCase";
import { Errors, USER_ERRORS } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class AdminUserController {
  constructor(
    private _getAllUserUseCase: IGetAllUsersUseCase,
    private _updateUserStatusUseCase: IUpdateUserStatusUseCase
  ) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllUserUseCase.getAllUser(page, limit, status, search);
      console.log("data from db: users list:", result);
      console.log(result);
      if (!result || result.users?.length === 0) {
        throw new NotFoundExecption(USER_ERRORS.NO_USERS_FOUND);
      }

      ResponseHelper.success(res, MESSAGES.USERS.GET_ALL_USERS, { data: result }, HTTPSTATUS.OK);
    } catch (error) {
      console.log("Error in getAllUsers: ", error);
      next(error);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, currentStatus } = req.body;

      if (!userId || !currentStatus) {
        throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
      }

      const result = await this._updateUserStatusUseCase.updateUserStatus(userId, currentStatus);

      ResponseHelper.success(
        res,
        MESSAGES.USERS.STATUS_UPDATED_SUCCESSFULLY,
        { data: result.user },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
