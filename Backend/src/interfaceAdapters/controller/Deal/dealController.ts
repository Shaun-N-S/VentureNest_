import { Request, Response, NextFunction } from "express";
import { ICreateDealInstallmentCheckoutUseCase } from "@domain/interfaces/useCases/deal/ICreateDealInstallmentCheckoutUseCase";
import { CreateDealInstallmentCheckoutDTO } from "application/dto/deal/createDealInstallmentCheckoutDTO";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import {
  ForbiddenException,
  InvalidDataException,
  NotFoundExecption,
} from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { GetMyDealsUseCase } from "application/useCases/Deal/getMyDealsUseCase";
import { GetDealDetailsUseCase } from "application/useCases/Deal/getDealDetailsUseCase";
import { IGetDealInstallmentsUseCase } from "@domain/interfaces/useCases/deal/IGetDealInstallmentsUseCase";
import { IReleaseDealInstallmentUseCase } from "@domain/interfaces/useCases/deal/IReleaseDealInstallmentUseCase";
import { PaymentMethod } from "@domain/enum/paymentMethod";

export class DealController {
  constructor(
    private _createDealInstallmentCheckoutUseCase: ICreateDealInstallmentCheckoutUseCase,
    private _getMyDealsUseCase: GetMyDealsUseCase,
    private _getDealDetailsUseCase: GetDealDetailsUseCase,
    private _getDealInstallmentsUseCase: IGetDealInstallmentsUseCase,
    private _releaseDealInstallmentUseCase: IReleaseDealInstallmentUseCase
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

  async getDealDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.user;
      const { dealId } = req.params;

      if (!dealId) {
        throw new NotFoundExecption(Errors.INVALID_DATA);
      }

      const result = await this._getDealDetailsUseCase.execute(userId, role, dealId);

      ResponseHelper.success(res, MESSAGES.DEAL.DEAL_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
  async getDealInstallments(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.user;
      const { dealId } = req.params;

      if (!dealId) throw new NotFoundExecption(Errors.INVALID_DATA);

      const result = await this._getDealInstallmentsUseCase.execute(userId, role, dealId);

      ResponseHelper.success(res, MESSAGES.DEAL.INSTALLMENTS_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async releaseInstallment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.user;
      const { dealId } = req.params;
      const { amount } = req.body;

      if (!userId) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }

      if (!dealId || !amount || amount <= 0) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._releaseDealInstallmentUseCase.execute(userId, {
        dealId,
        amount,
        paymentMethod: PaymentMethod.WALLET,
      });

      ResponseHelper.success(res, MESSAGES.DEAL.INSTALLMENT_RELEASED, null, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
