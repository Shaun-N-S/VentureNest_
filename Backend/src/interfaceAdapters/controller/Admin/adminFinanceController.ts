import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { IGetAdminTransactionsUseCase } from "@domain/interfaces/useCases/admin/transaction/IGetAdminTransactionsUseCase";
import { MESSAGES } from "@shared/constants/messages";
import { IGetAdminFinanceSummaryUseCase } from "@domain/interfaces/useCases/admin/finance/IGetAdminFinanceSummaryUseCase";
import { IGetAdminPlatformWalletUseCase } from "@domain/interfaces/useCases/admin/finance/IGetAdminPlatformWalletUseCase";

export class AdminFinanceController {
  constructor(
    private _getAdminTransactionsUseCase: IGetAdminTransactionsUseCase,
    private _getAdminFinanceSummaryUseCase: IGetAdminFinanceSummaryUseCase,
    private _getAdminPlatformWalletUseCase: IGetAdminPlatformWalletUseCase
  ) {}

  async getAdminTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._getAdminTransactionsUseCase.execute({
        reason: req.query.reason as string,
        action: req.query.action as string,
        status: req.query.status as string,
        dealId: req.query.dealId as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
      });

      ResponseHelper.success(res, MESSAGES.ADMIN.TRANSACTIONS_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getFinanceSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._getAdminFinanceSummaryUseCase.execute();

      ResponseHelper.success(res, MESSAGES.ADMIN.FINANCE_SUMMARY_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getPlatformWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._getAdminPlatformWalletUseCase.execute();

      ResponseHelper.success(res, "Platform wallet fetched successfully", result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
