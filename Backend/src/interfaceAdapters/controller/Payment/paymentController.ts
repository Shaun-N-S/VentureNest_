import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { MESSAGES } from "@shared/constants/messages";
import { IGetPaymentSessionSummaryUseCase } from "@domain/interfaces/useCases/payment/IGetPaymentSessionSummaryUseCase";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";

export class PaymentController {
  constructor(private _getPaymentSessionSummaryUseCase: IGetPaymentSessionSummaryUseCase) {}

  async getSessionSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._getPaymentSessionSummaryUseCase.execute(sessionId);

      ResponseHelper.success(
        res,
        MESSAGES.PAYMENT.SESSION_FETCHED_SUCCESSFULLY,
        data,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
