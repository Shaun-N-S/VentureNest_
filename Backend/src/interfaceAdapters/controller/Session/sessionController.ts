import { Request, Response, NextFunction } from "express";
import { ICancelSessionUseCase } from "@domain/interfaces/useCases/session/ICancelSessionUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import {
  addSessionFeedbackSchema,
  cancelSessionSchema,
} from "../../../shared/validations/sessionValidation";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { MESSAGES } from "@shared/constants/messages";
import { ICreateSessionFeedbackUseCase } from "@domain/interfaces/useCases/session/ICreateSessionFeedbackUseCase";

export class SessionController {
  constructor(
    private _cancelSessionUseCase: ICancelSessionUseCase,
    private _addSessionFeedbackUseCase: ICreateSessionFeedbackUseCase
  ) {}

  async cancelSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const { reason } = cancelSessionSchema.parse(req.body);

      if (!sessionId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const userId = res.locals.user.userId;
      const role = res.locals.user.role;

      const cancelledBy =
        role === "INVESTOR" ? SessionCancelledBy.INVESTOR : SessionCancelledBy.USER;

      const result = await this._cancelSessionUseCase.execute({
        sessionId,
        userId,
        cancelledBy,
        reason,
      });

      ResponseHelper.success(res, MESSAGES.SESSION.SESSION_CANCELLED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async addSessionFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const { feedback, decision } = addSessionFeedbackSchema.parse(req.body);

      if (!sessionId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const investorId = res.locals.user.userId;

      const result = await this._addSessionFeedbackUseCase.execute({
        sessionId,
        investorId,
        feedback,
        decision,
      });

      ResponseHelper.success(res, MESSAGES.SESSION.SESSION_FEEDBACK_ADDED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
