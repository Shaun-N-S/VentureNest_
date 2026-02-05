import { Request, Response, NextFunction } from "express";
import { ICreateInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/ICreateInvestmentOfferUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { createInvestmentOfferSchema } from "@shared/validations/investmentOfferValidation";
import { IGetSentInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetSentInvestmentOffersUseCase";

export class InvestmentOfferController {
  constructor(
    private _createInvestmentOfferUseCase: ICreateInvestmentOfferUseCase,
    private _getSentOffersUseCase: IGetSentInvestmentOffersUseCase
  ) {}

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

  async getSentOffers(req: Request, res: Response, next: NextFunction) {
    try {
      const investorId = res.locals.user.userId;

      const result = await this._getSentOffersUseCase.execute(investorId);

      ResponseHelper.success(res, MESSAGES.OFFER.OFFERS_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
