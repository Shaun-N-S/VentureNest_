import { Request, Response, NextFunction } from "express";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { IGetAdminTransactionsUseCase } from "@domain/interfaces/useCases/admin/transaction/IGetAdminTransactionsUseCase";
import { MESSAGES } from "@shared/constants/messages";

export class AdminFinanceController {
  constructor(private readonly getAdminTransactionsUseCase: IGetAdminTransactionsUseCase) {}

  async getAdminTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getAdminTransactionsUseCase.execute({
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
}
