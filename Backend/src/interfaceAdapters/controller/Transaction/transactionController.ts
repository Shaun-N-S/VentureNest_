import { TransactionAction } from "@domain/enum/transactionType";
import { IGetWalletTransactionsUseCase } from "@domain/interfaces/useCases/transaction/IGetWalletTransactionsUseCase";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { NextFunction, Request, Response } from "express";

export class TransactionController {
  constructor(private _getWalletTransactionsUseCase: IGetWalletTransactionsUseCase) {}

  async getMyWalletTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.user;
      const { action } = req.query;

      const transactions = await this._getWalletTransactionsUseCase.execute({
        ownerId: userId,
        ownerType: role,
        action: action as TransactionAction,
      });

      ResponseHelper.success(res, MESSAGES.WALLET.WALLET_TRANSACTION, transactions, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
