import { Request, Response, NextFunction } from "express";
import { IGetProjectShareIssuancesUseCase } from "@domain/interfaces/useCases/shareIssuance/IGetProjectShareIssuancesUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";

export class ShareIssuanceController {
  constructor(
    private readonly _getProjectShareIssuancesUseCase: IGetProjectShareIssuancesUseCase
  ) {}

  async getProjectShareIssuances(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const result = await this._getProjectShareIssuancesUseCase.execute(id);

      ResponseHelper.success(res, MESSAGES.DEAL.DEAL_FETCHED, result, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
