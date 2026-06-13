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
import {
  DataMissingExecption,
  ForbiddenException,
  InvalidDataException,
} from "application/constants/exceptions";
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
      const investorId = res.locals?.user?.userId;

      if (!investorId) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }

      let formData;

      try {
        formData = req.body?.formData ? JSON.parse(req.body.formData) : undefined;
      } catch {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

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
        throw new InvalidDataException(
          validatedData.error.issues[0]?.message || Errors.INVALID_DATA
        );
      }

      const result = await this._investorProfileCompletionUseCase.profileCompletion(
        validatedData.data
      );

      ResponseHelper.success(
        res,
        MESSAGES.INVESTOR.PROFILE_COMPLETION_SUCCESS,
        { data: result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getProfileData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
      const investorId = res.locals?.user?.userId;

      if (!investorId) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }

      let formData;

      try {
        formData = req.body?.formData ? JSON.parse(req.body.formData) : undefined;
      } catch {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }
      const files = req.files as MulterFiles<"profileImg">;

      const data: InvestorProfileUpdateDTO = { id: investorId, formData };

      if (files["profileImg"]?.[0]) {
        data.profileImg = multerFileToFileConverter(files["profileImg"][0]);
      }

      const validatedData = investorProfileUpdateSchema.safeParse(data);

      if (validatedData.error) {
        throw new InvalidDataException(
          validatedData.error.issues[0]?.message || Errors.INVALID_DATA
        );
      }

      const response = await this._investorProfileUpdateUseCase.updateInvestorProfile(
        validatedData.data as InvestorProfileUpdateDTO
      );

      ResponseHelper.success(
        res,
        MESSAGES.INVESTOR.PROFILE_UPDATED_SUCCESS,
        { response },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updateKYC(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals?.user?.userId;

      if (!userId) {
        throw new ForbiddenException(Errors.UNAUTHORIZED_ACCESS);
      }

      let formData;

      try {
        formData = req.body?.formData ? JSON.parse(req.body.formData) : undefined;
      } catch {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }
      const files = req.files as MulterFiles<"aadharImg" | "selfieImg">;

      const formattedFormData = formData
        ? {
            ...formData,
            dateOfBirth: new Date(formData.dateOfBirth),
          }
        : null;

      const data: InvestorKYCUpdateDTO = { id: userId, formData: formattedFormData };

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
          dateOfBirth: data.formData?.dateOfBirth
            ? data.formData.dateOfBirth.toISOString()
            : undefined,
        },
      });

      if (!validatedData.success) {
        throw new InvalidDataException(
          validatedData.error.issues[0]?.message || Errors.INVALID_DATA
        );
      }

      const response = await this._kycUpdateUseCase.updateKYC(data);

      ResponseHelper.success(res, MESSAGES.KYC.UPDATED_SUCCESSFULLY, { response }, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
