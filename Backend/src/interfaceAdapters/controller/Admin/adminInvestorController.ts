import { IGetAllInvestorUseCase } from "@domain/interfaces/useCases/admin/investor/IGetAllInvestorUseCase";
import { IUpdateInvestorStatusUseCase } from "@domain/interfaces/useCases/admin/investor/IUpdateInvestorStatusUseCase";
import { Errors, INVESTOR_ERRORS } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class AdminInvestorController {
  constructor(
    private _getAllInvestorUseCase: IGetAllInvestorUseCase,
    private _updateInvestorStatusUseCase: IUpdateInvestorStatusUseCase
  ) {}

  async getAllInvestor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllInvestorUseCase.getAllInvestors(page, limit, status, search);
      console.log(result);

      if (!result || result.investors?.length === 0) {
        throw new InvalidDataException(INVESTOR_ERRORS.NO_INVESTORS_FOUND);
      }

      ResponseHelper.success(
        res,
        MESSAGES.USERS.GET_ALL_INVESTORS,
        { data: result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      console.log("Error in getAllInvestor: ", error);
      next(error);
    }
  }

  async updateInvestorStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { investorId, currentStatus } = req.body;

      if (!investorId || !currentStatus) {
        throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
      }

      const result = await this._updateInvestorStatusUseCase.updateInvestorStatus(
        investorId,
        currentStatus
      );

      ResponseHelper.success(
        res,
        MESSAGES.ADMIN.UPDATE_STATUS,
        { data: result.investor },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
