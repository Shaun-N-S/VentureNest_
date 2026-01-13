import { ICreatePlanUseCase } from "@domain/interfaces/useCases/admin/plan/ICreatePlanUseCase";
import { createPlanSchema } from "@shared/validations/planValidator";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException } from "application/constants/exceptions";
import { Request, Response, NextFunction } from "express";

export class AdminPlanController {
  constructor(private _createPlanUseCase: ICreatePlanUseCase) {}

  async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createPlanSchema.safeParse(req.body);

      if (!validated.success) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._createPlanUseCase.execute(validated.data);

      ResponseHelper.success(res, MESSAGES.PLAN.CREATED_SUCCESSFULLY, result, HTTPSTATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }
}
