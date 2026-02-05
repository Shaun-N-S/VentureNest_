import { Request, Response, NextFunction } from "express";
import { ICreateInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/ICreateInvestmentOfferUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { createInvestmentOfferSchema } from "@shared/validations/investmentOfferValidation";

export class InvestmentOfferController {
  constructor(private readonly _createInvestmentOfferUseCase: ICreateInvestmentOfferUseCase) {}

  async createOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createInvestmentOfferSchema.parse(req.body);

      const investorId = res.locals.user.userId;

      const result = await this._createInvestmentOfferUseCase.execute(payload, investorId);

      ResponseHelper.success(res, MESSAGES.OFFER.OFFER_SENT, result, HTTPSTATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }
}
