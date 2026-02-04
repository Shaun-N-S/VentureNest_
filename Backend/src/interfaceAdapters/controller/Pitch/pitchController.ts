import { Request, Response, NextFunction } from "express";
import { ICreatePitchUseCase } from "@domain/interfaces/useCases/pitch/ICreatePitchUseCase";
import { createPitchSchema } from "@shared/validations/pitchValidation";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";

export class PitchController {
  constructor(private readonly _createPitchUseCase: ICreatePitchUseCase) {}

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
}
