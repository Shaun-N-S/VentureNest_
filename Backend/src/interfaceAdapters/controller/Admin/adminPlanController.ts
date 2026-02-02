import { ICreatePlanUseCase } from "@domain/interfaces/useCases/admin/plan/ICreatePlanUseCase";
import {
  createPlanSchema,
  updatePlanSchema,
  updatePlanStatusSchema,
} from "@shared/validations/planValidator";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException } from "application/constants/exceptions";
import { Request, Response, NextFunction } from "express";
import { IGetAllPlansUseCase } from "@domain/interfaces/useCases/admin/plan/IGetAllPlansUseCase";
import { IGetPlanByIdUseCase } from "@domain/interfaces/useCases/admin/plan/IGetPlanByIdUseCase";
import { IUpdatePlanUseCase } from "@domain/interfaces/useCases/admin/plan/IUpdatePlanUseCase";
import { IUpdatePlanStatusUseCase } from "@domain/interfaces/useCases/admin/plan/IUpdatePlanStatusUseCase";

export class AdminPlanController {
  constructor(
    private _createPlanUseCase: ICreatePlanUseCase,
    private _getAllPlansUseCase: IGetAllPlansUseCase,
    private _getPlanByIdUseCase: IGetPlanByIdUseCase,
    private _updatePlanUseCase: IUpdatePlanUseCase,
    private _updatePlanStatusUseCase: IUpdatePlanStatusUseCase
  ) {}

  async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body);
      const validated = createPlanSchema.safeParse(req.body);

      if (!validated.success) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._createPlanUseCase.execute(req.body);

      ResponseHelper.success(res, MESSAGES.PLAN.CREATED_SUCCESSFULLY, result, HTTPSTATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      const data = await this._getAllPlansUseCase.execute(page, limit, status, search);

      ResponseHelper.success(res, MESSAGES.PLAN.FETCHED_SUCCESSFULLY, data, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;

      if (!planId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const data = await this._getPlanByIdUseCase.execute(planId);

      ResponseHelper.success(res, MESSAGES.PLAN.FETCHED_SUCCESSFULLY, data, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;

      if (!planId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const validated = updatePlanSchema.safeParse(req.body);

      if (!validated.success) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._updatePlanUseCase.execute(planId, validated.data);

      ResponseHelper.success(res, MESSAGES.PLAN.UPDATED_SUCCESSFULLY, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
  async updatePlanStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;

      if (!planId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const validated = updatePlanStatusSchema.safeParse(req.body);

      if (!validated.success) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._updatePlanStatusUseCase.execute(planId, validated.data.status!);

      ResponseHelper.success(res, MESSAGES.PLAN.STATUS_UPDATED_SUCCESSFULLY, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
