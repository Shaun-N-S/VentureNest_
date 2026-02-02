import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { MESSAGES } from "@shared/constants/messages";
import { IGetAvailablePlansUseCase } from "@domain/interfaces/useCases/plan/IGetAvailablePlans";

export class PlanController {
  constructor(private _getAvailablePlansUseCase: IGetAvailablePlansUseCase) {}

  async getAvailablePlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = res.locals.user.role;

      const data = await this._getAvailablePlansUseCase.execute(userRole);

      ResponseHelper.success(res, MESSAGES.PLAN.FETCHED_SUCCESSFULLY, data, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
