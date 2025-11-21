import { ISendConnectionReqUseCase } from "@domain/interfaces/useCases/relationship/ISendConnectionReqUseCase";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class RelationshipController {
  constructor(private _sendConnectionReqUseCase: ISendConnectionReqUseCase) {}

  async sendConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const fromUserId = res.locals?.user?.userId;
      const toUserId = req.params.toUserId;

      if (!toUserId || !fromUserId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._sendConnectionReqUseCase.execute(fromUserId, toUserId);

      ResponseHelper.success(
        res,
        MESSAGES.RELATIONSHIP.CONNECTION_SEND_SUCCESSFULLY,
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
