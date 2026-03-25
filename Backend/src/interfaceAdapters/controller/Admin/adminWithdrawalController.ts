import { IApproveWithdrawalUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IApproveWithdrawalUseCase";
import { IGetWithdrawalsUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IGetWithdrawalsUseCase";
import { IRejectWithdrawalUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IRejectWithdrawalUseCase";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { NextFunction, Request, Response } from "express";

export class AdminWithdrawalController {
  constructor(
    private _approveUseCase: IApproveWithdrawalUseCase,
    private _rejectUseCase: IRejectWithdrawalUseCase,
    private _getUseCase: IGetWithdrawalsUseCase
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._getUseCase.execute(req.query as any);
      ResponseHelper.success(res, "Withdrawals fetched", result, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      await this._approveUseCase.execute(req.params.id!);
      ResponseHelper.success(res, "Approved", null, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      await this._rejectUseCase.execute(req.params.id!);
      ResponseHelper.success(res, "Rejected", null, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }
}
