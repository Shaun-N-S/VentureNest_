import { Request, Response, NextFunction } from "express";
import { ICreatePitchUseCase } from "@domain/interfaces/useCases/pitch/ICreatePitchUseCase";
import { createPitchSchema } from "@shared/validations/pitchValidation";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { IGetReceivedPitchesUseCase } from "@domain/interfaces/useCases/pitch/IGetReceivedPitchesUseCase";
import { IGetSentPitchesUseCase } from "@domain/interfaces/useCases/pitch/IGetSentPitchesUseCase";
import { IGetPitchDetailsUseCase } from "@domain/interfaces/useCases/pitch/IGetPitchDetailsUseCase";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { IRespondToPitchUseCase } from "@domain/interfaces/useCases/pitch/IRespondToPitchUseCase";
import { respondPitchSchema } from "@shared/validations/respondValidation";

export class PitchController {
  constructor(
    private _createPitchUseCase: ICreatePitchUseCase,
    private _getReceivedPitchesUseCase: IGetReceivedPitchesUseCase,
    private _getSentPitchesUseCase: IGetSentPitchesUseCase,
    private _getPitchDetailsUseCase: IGetPitchDetailsUseCase,
    private _respondToPitchUseCase: IRespondToPitchUseCase
  ) {}

  async createPitch(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createPitchSchema.parse(req.body);

      const founderId = res.locals.user.userId;

      const result = await this._createPitchUseCase.execute({
        ...payload,
        founderId,
      });

      ResponseHelper.success(res, MESSAGES.PITCH.PITCH_SENT, result, HTTPSTATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getReceivedPitches(req: Request, res: Response, next: NextFunction) {
    try {
      const investorId = res.locals.user.userId;

      const result = await this._getReceivedPitchesUseCase.execute(investorId);

      ResponseHelper.success(res, MESSAGES.PITCH.PITCHES_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getSentPitches(req: Request, res: Response, next: NextFunction) {
    try {
      const founderId = res.locals.user.userId;

      const result = await this._getSentPitchesUseCase.execute(founderId);

      ResponseHelper.success(res, MESSAGES.PITCH.PITCHES_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getPitchDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const viewerId = res.locals.user.userId;

      if (!id) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._getPitchDetailsUseCase.execute(id, viewerId);

      ResponseHelper.success(res, MESSAGES.PITCH.PITCH_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async respondToPitch(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { message } = respondPitchSchema.parse(req.body);
      const investorId = res.locals.user.userId;

      if (!id || !message) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._respondToPitchUseCase.execute(id, investorId, message);

      ResponseHelper.success(res, MESSAGES.PITCH.PITCH_RESPONDED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
