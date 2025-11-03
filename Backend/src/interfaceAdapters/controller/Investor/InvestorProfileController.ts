import { IInvestorProfileCompletionUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorProfileCompletionUseCase";
import { MulterFiles } from "@domain/types/multerFilesType";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { multerFileToFileConverter } from "@shared/utils/fileConverter";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvestorProfileCompletionReqSchema } from "@shared/validations/investorProfileCompletionValidator";
import { InvalidDataException } from "application/constants/exceptions";
import { InvestorProfileCompletionReqDTO } from "application/dto/investor/investorProfileCompletionDTO";
import { NextFunction, Request, Response } from "express";

export class InvestorProfileController {
  constructor(private _investorProfileCompletionUseCase: IInvestorProfileCompletionUseCase) {}

  async profileCompletion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const investorId = req.body?.investorId;
      const formData = req.body?.formData ? JSON.parse(req.body.formData) : null;
      const files = req.files as MulterFiles<"profileImg" | "portfolioPdf">;

      const data: InvestorProfileCompletionReqDTO = { id: investorId, formData };

      if (files["profileImg"]?.[0]) {
        data.profileImg = multerFileToFileConverter(files["profileImg"][0]);
      }

      if (files["portfolioPdf"]?.[0]) {
        data.portfolioPdf = multerFileToFileConverter(files["portfolioPdf"][0]);
      }

      const validatedData = InvestorProfileCompletionReqSchema.safeParse(data);
      console.log("validataed data from the controller : : : ", validatedData.data);
      console.log("validated data error :::, ", validatedData.error);
      if (validatedData.error) {
        throw new InvalidDataException(validatedData.error.message);
      }

      const result = await this._investorProfileCompletionUseCase.profileCompletion(
        validatedData.data!
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
