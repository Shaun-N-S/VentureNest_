import { Request, Response, NextFunction } from "express";
import { ICreateInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/ICreateInvestmentOfferUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { createInvestmentOfferSchema } from "@shared/validations/investmentOfferValidation";
import { IGetSentInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetSentInvestmentOffersUseCase";
import { IGetReceivedInvestmentOffersUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetReceivedInvestmentOffersUseCase";
import { IGetInvestmentOfferDetailsUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IGetInvestmentOfferDetailsUseCase";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { IAcceptInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IAcceptInvestmentOfferUseCase";
import { IRejectInvestmentOfferUseCase } from "@domain/interfaces/useCases/investor/investmentOffer/IRejectInvestmentOfferUseCase";
import { OfferStatus } from "@domain/enum/offerStatus";

export class InvestmentOfferController {
  constructor(
    private _createInvestmentOfferUseCase: ICreateInvestmentOfferUseCase,
    private _getSentOffersUseCase: IGetSentInvestmentOffersUseCase,
    private _getReceivedOffersUseCase: IGetReceivedInvestmentOffersUseCase,
    private _getOfferDetailsUseCase: IGetInvestmentOfferDetailsUseCase,
    private _acceptInvestmentOfferUseCase: IAcceptInvestmentOfferUseCase,
    private _rejectInvestmentOfferUseCase: IRejectInvestmentOfferUseCase
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
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const status = req.query.status as OfferStatus | undefined;
      const search = req.query.search as string | undefined;

      const result = await this._getSentOffersUseCase.execute(
        investorId,
        page,
        limit,
        status,
        search
      );

      ResponseHelper.success(res, MESSAGES.OFFER.OFFERS_FETCHED, result);
    } catch (error) {
      next(error);
    }
  }

  async getReceivedOffers(req: Request, res: Response, next: NextFunction) {
    try {
      const founderId = res.locals.user.userId;
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const status = req.query.status as OfferStatus | undefined;
      const search = req.query.search as string | undefined;

      const result = await this._getReceivedOffersUseCase.execute(
        founderId,
        page,
        limit,
        status,
        search
      );

      ResponseHelper.success(res, MESSAGES.OFFER.OFFERS_FETCHED, result);
    } catch (error) {
      next(error);
    }
  }

  async getOfferDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { offerId } = req.params;
      const viewerId = res.locals.user.userId;

      if (!offerId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._getOfferDetailsUseCase.execute(offerId, viewerId);

      ResponseHelper.success(res, MESSAGES.OFFER.OFFERS_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async acceptOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { offerId } = req.params;
      const founderId = res.locals.user.userId;

      if (!offerId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._acceptInvestmentOfferUseCase.execute(offerId, founderId);

      ResponseHelper.success(res, MESSAGES.OFFER.OFFER_ACCEPTED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
  async rejectOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { offerId } = req.params;
      const { reason } = req.body;
      const founderId = res.locals.user.userId;

      if (!offerId || !reason) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._rejectInvestmentOfferUseCase.execute(offerId, founderId, reason);

      ResponseHelper.success(res, MESSAGES.OFFER.OFFER_REJECTED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
