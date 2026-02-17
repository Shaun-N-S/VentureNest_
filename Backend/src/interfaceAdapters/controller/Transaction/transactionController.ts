import { IGetWalletTransactionsUseCase } from "@domain/interfaces/useCases/transaction/IGetWalletTransactionsUseCase";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { TransactionAction } from "@domain/enum/transactionType";
import { NextFunction, Request, Response } from "express";
import { GetWalletTransactionsRequestDTO } from "application/dto/transaction/transactionDTO";
import { ForbiddenException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";

export class TransactionController {
  constructor(private readonly getWalletTransactionsUseCase: IGetWalletTransactionsUseCase) {}

  async getMyWalletTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = res.locals.user;

      if (!user?.userId || !user?.role) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }

      const requestDTO: GetWalletTransactionsRequestDTO = {
        ownerId: user.userId!,
        ownerRole: user.role!,
      };

      if (req.query.action) {
        requestDTO.action = req.query.action as TransactionAction;
      }

      const transactions = await this.getWalletTransactionsUseCase.execute(requestDTO);

      ResponseHelper.success(res, MESSAGES.WALLET.WALLET_TRANSACTION, transactions, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
