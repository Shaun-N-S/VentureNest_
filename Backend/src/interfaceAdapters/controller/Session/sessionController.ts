import { Request, Response, NextFunction } from "express";
import { ICancelSessionUseCase } from "@domain/interfaces/useCases/session/ICancelSessionUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import {
  addSessionFeedbackSchema,
  approveUserSchema,
  cancelSessionSchema,
} from "../../../shared/validations/sessionValidation";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { MESSAGES } from "@shared/constants/messages";
import { ICreateSessionFeedbackUseCase } from "@domain/interfaces/useCases/session/ICreateSessionFeedbackUseCase";
import { IJoinSessionUseCase } from "@domain/interfaces/useCases/session/IJoinSessionUseCase";
import { IApproveUserUseCase } from "@domain/interfaces/useCases/session/IApproveUserUseCase";
import { IGetSessionStatusUseCase } from "@domain/interfaces/useCases/session/IGetSessionStatusUseCase";
import { ICompleteSessionUseCase } from "@domain/interfaces/useCases/session/ICompleteSessionUseCase";

export class SessionController {
  constructor(
    private _cancelSessionUseCase: ICancelSessionUseCase,
    private _addSessionFeedbackUseCase: ICreateSessionFeedbackUseCase,
    private _joinSessionUseCase: IJoinSessionUseCase,
    private _approveUserUseCase: IApproveUserUseCase,
    private _getSessionStatusUseCase: IGetSessionStatusUseCase,
    private _completeSessionUseCase: ICompleteSessionUseCase
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

  async joinSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const userId = res.locals.user.userId;

      const result = await this._joinSessionUseCase.execute({
        sessionId,
        userId,
      });

      ResponseHelper.success(res, MESSAGES.SESSION.JOIN_REQUEST_SUCCESSFUL, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async approveUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const { userId } = approveUserSchema.parse(req.body);

      if (!sessionId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const investorId = res.locals.user.userId;

      const result = await this._approveUserUseCase.execute({
        sessionId,
        userId,
        investorId,
      });

      ResponseHelper.success(res, MESSAGES.SESSION.USER_APPROVED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getSessionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const userId = res.locals.user.userId;

      const result = await this._getSessionStatusUseCase.execute({
        sessionId,
        userId,
      });

      ResponseHelper.success(res, MESSAGES.SESSION.STATUS_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async completeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const userId = res.locals.user.userId;

      await this._completeSessionUseCase.execute(sessionId, userId);

      ResponseHelper.success(res, MESSAGES.SESSION.SESSION_COMPLETED, null, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
