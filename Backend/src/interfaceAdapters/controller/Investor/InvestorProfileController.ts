import { IKYCUpdateUseCase } from "@domain/interfaces/useCases/auth/IKYCUpdateUseCase";
import { IFetchInvestorProfileUseCase } from "@domain/interfaces/useCases/investor/profile/IFetchInvestorProfileUseCase";
import { IInvestorProfileCompletionUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorProfileCompletionUseCase";
import { IInvestorProfileUpdateUseCase } from "@domain/interfaces/useCases/investor/profile/IInvestorProfileUpdateUseCase";
import { MulterFiles } from "@domain/types/multerFilesType";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { multerFileToFileConverter } from "@shared/utils/fileConverter";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvestorKYCSchema } from "@shared/validations/investorKYCValidator";
import { InvestorProfileCompletionReqSchema } from "@shared/validations/investorProfileCompletionValidator";
import { investorProfileUpdateSchema } from "@shared/validations/investorProfileUpdateValidator";
import { DataMissingExecption, InvalidDataException } from "application/constants/exceptions";
import { InvestorKYCUpdateDTO } from "application/dto/investor/investorKYCUpdateDTO";
import { InvestorProfileCompletionReqDTO } from "application/dto/investor/investorProfileCompletionDTO";
import { InvestorProfileUpdateDTO } from "application/dto/investor/investorProfileDTO";
import { NextFunction, Request, Response } from "express";

export class InvestorProfileController {
  constructor(
    private _fetchInvestorProfileUseCase: IFetchInvestorProfileUseCase,
    private _investorProfileCompletionUseCase: IInvestorProfileCompletionUseCase,
    private _investorProfileUpdateUseCase: IInvestorProfileUpdateUseCase,
    private _kycUpdateUseCase: IKYCUpdateUseCase
  ) {}

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

      if (validatedData.error) {
        throw new InvalidDataException(Errors.INVALID_DATA);
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

  async getProfileData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("reached controller ");
      const { id } = req.params;

      if (!id) {
        throw new DataMissingExecption(Errors.INVALID_DATA);
      }

      const profileData = await this._fetchInvestorProfileUseCase.getProfileData(id);

      ResponseHelper.success(
        res,
        MESSAGES.INVESTOR.PROFILE_DATA_SUCCESS,
        { profileData },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProfileData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("data from the frontend reached the backend : : : ,", req.body);
      const investorId = req.body?.id;
      const formData = req.body?.formData ? JSON.parse(req.body.formData) : null;
      const files = req.files as MulterFiles<"profileImg">;
      console.log("investor ID :", investorId, "formdata : : ", formData, "files : : : ", files);

      const data: InvestorProfileUpdateDTO = { id: investorId, formData };

      if (files["profileImg"]?.[0]) {
        data.profileImg = multerFileToFileConverter(files["profileImg"][0]);
      }

      const validatedData = investorProfileUpdateSchema.parse(data) as InvestorProfileUpdateDTO;

      if (!validatedData) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const response = await this._investorProfileUpdateUseCase.updateInvestorProfile(
        validatedData!
      );

      ResponseHelper.success(
        res,
        MESSAGES.INVESTOR.PROFILE_UPDATED_SUCCESS,
        { response },
        HTTPSTATUS.OK
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async updateKYC(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.body?.id;
      const formData = req.body?.formData ? JSON.parse(req.body?.formData) : null;
      const files = req.files as MulterFiles<"aadharImg" | "selfieImg">;

      console.log(id, "formdata ::", formData, "files", files);

      const formattedFormData = formData
        ? {
            ...formData,
            dateOfBirth: new Date(formData.dateOfBirth),
          }
        : null;

      const data: InvestorKYCUpdateDTO = { id, formData: formattedFormData };

      if (files["aadharImg"]?.[0]) {
        data.aadharImg = multerFileToFileConverter(files["aadharImg"][0]);
      }

      if (files["selfieImg"]?.[0]) {
        data.selfieImg = multerFileToFileConverter(files["selfieImg"][0]);
      }

      const validatedData = InvestorKYCSchema.safeParse({
        ...data,
        formData: {
          ...data.formData,
          dateOfBirth: data.formData?.dateOfBirth.toISOString(),
        },
      });

      if (!validatedData.success) {
        console.log(validatedData.error);
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const response = await this._kycUpdateUseCase.updateKYC(data);

      ResponseHelper.success(res, MESSAGES.KYC.UPDATED_SUCCESSFULLY, { response }, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
