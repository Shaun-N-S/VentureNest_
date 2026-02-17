import { Request, Response, NextFunction } from "express";
import { ICreateDealInstallmentCheckoutUseCase } from "@domain/interfaces/useCases/deal/ICreateDealInstallmentCheckoutUseCase";
import { CreateDealInstallmentCheckoutDTO } from "application/dto/deal/createDealInstallmentCheckoutDTO";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";

export class DealController {
  constructor(
    private _createDealInstallmentCheckoutUseCase: ICreateDealInstallmentCheckoutUseCase
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
}
