import { Request, Response, NextFunction } from "express";
import { ICreateDealInstallmentCheckoutUseCase } from "@domain/interfaces/useCases/deal/ICreateDealInstallmentCheckoutUseCase";
import { CreateDealInstallmentCheckoutDTO } from "application/dto/deal/createDealInstallmentCheckoutDTO";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ForbiddenException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { GetMyDealsUseCase } from "application/useCases/Deal/getMyDealsUseCase";

export class DealController {
  constructor(
    private _createDealInstallmentCheckoutUseCase: ICreateDealInstallmentCheckoutUseCase,
    private _getMyDealsUseCase: GetMyDealsUseCase
  ) {}

  async createInstallmentCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      const dto: CreateDealInstallmentCheckoutDTO = {
        dealId: req.body.dealId,
        amount: req.body.amount,
      };

      const sessionUrl = await this._createDealInstallmentCheckoutUseCase.execute(user.userId, dto);

      ResponseHelper.success(res, MESSAGES.PAYMENT.CHECKOUT_CREATED, sessionUrl, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getMyDeals(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      if (!user?.userId || !user?.role) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }

      const deals = await this._getMyDealsUseCase.execute(user.userId, user.role);

      ResponseHelper.success(res, MESSAGES.DEAL.DEALS_FETCHED, deals, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
