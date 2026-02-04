import { Request, Response, NextFunction } from "express";
import { ICancelSessionUseCase } from "@domain/interfaces/useCases/session/ICancelSessionUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { SessionCancelledBy } from "@domain/enum/sessionCancelledBy";
import { cancelSessionSchema } from "../../../shared/validations/sessionValidation";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { MESSAGES } from "@shared/constants/messages";

export class SessionController {
  constructor(private _cancelSessionUseCase: ICancelSessionUseCase) {}

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
}
