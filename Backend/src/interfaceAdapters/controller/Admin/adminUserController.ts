import { IGetAllUsersUseCase } from "@domain/interfaces/useCases/admin/user/IGetAllUsersUseCase";
import { IUpdateUserStatusUseCase } from "@domain/interfaces/useCases/admin/user/IUpdateUserStatusUseCase";
import { Errors } from "@shared/constants/error";
import { HTTPStatus } from "@shared/constants/httpStatus";
import { Request, Response } from "express";

export class AdminUserController {
  constructor(
    private _getAllUserUseCase: IGetAllUsersUseCase,
    private _updateUserStatusUseCase: IUpdateUserStatusUseCase
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      if (page < 1 || limit < 1 || limit > 100) {
        res.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          message: Errors.INVALID_PAGINATION_PARAMETERS,
        });
        return;
      }

      const result = await this._getAllUserUseCase.getAllUser(page, limit, status, search);

      res.status(HTTPStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log("Error in getAllUsers: ", error);
      res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        message: Errors.FAILED_USER_FETCHING,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId, currentStatus } = req.body;

      if (!userId || !currentStatus) {
        res.status(400).json({ message: Errors.INVALID_CREDENTIALS });
        return;
      }

      const result = await this._updateUserStatusUseCase.updateUserStatus(userId, currentStatus);

      res.status(200).json({
        success: true,
        message: "User status updated successfully",
        data: result.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update user status",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
