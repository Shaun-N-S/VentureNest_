import { IInvestorProfileCompletionUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorProfileCompletionUseCase";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { NotFoundExecption } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";
import { success } from "zod";

export class InvestorProfileController {
  constructor(private _investorProfileCompletionUseCase: IInvestorProfileCompletionUseCase) {}

  async profileCompletion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("hello reached backend ", req.body);
      console.log("investor id : ", req.body?.investorData?._id);
      console.log("investor profilecompletion data : ", req.body.formData);
      const investorId = req.body?.investorId;
      const formData = req.body?.formData;

      if (!investorId) {
        throw new NotFoundExecption("Investor Id missing");
      }

      const result = await this._investorProfileCompletionUseCase.profileCompletion(
        investorId,
        formData
      );

      ResponseHelper.success(
        res,
        MESSAGES.INVESTOR.PROFILE_COMPLETION_SUCCESS,
        { data: result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
