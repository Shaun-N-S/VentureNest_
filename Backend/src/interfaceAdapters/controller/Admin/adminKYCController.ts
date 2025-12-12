import { IGetAllInvestorKycUseCase } from "@domain/interfaces/useCases/admin/kyc/IGetAllInvestorKycUseCase";
import { IGetAllUserKycUseCase } from "@domain/interfaces/useCases/admin/kyc/IGetAllUserKycUseCase";
import { IUpdateInvestorKycStatusUseCase } from "@domain/interfaces/useCases/admin/kyc/IUpdateInvestorKycUseCase";
import { IUpdateUserKycStatusUseCase } from "@domain/interfaces/useCases/admin/kyc/IUpdateUserKycUseCase";
import { Errors } from "@shared/constants/error";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { MESSAGES } from "@shared/constants/messages";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException } from "application/constants/exceptions";
import { NextFunction, Request, Response } from "express";

export class AdminKYCController {
  constructor(
    private _getAllUserKycUseCase: IGetAllUserKycUseCase,
    private _getAllInvestorKycUseCase: IGetAllInvestorKycUseCase,
    private _updateUserKycStatusUseCase: IUpdateUserKycStatusUseCase,
    private _updateInvestorKycStatusUseCase: IUpdateInvestorKycStatusUseCase
  ) {}

  async getAllUserKyc(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllUserKycUseCase.getAllUsersKyc(page, limit, status, search);
      console.log(result);

      // if (!result || result.usersKyc?.length === 0) {
      //   throw new InvalidDataException(Errors.NO_KYC_FOUND);
      // }

      ResponseHelper.success(
        res,
        MESSAGES.KYC.FETCHED_SUCCESSFULLY,
        { data: result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllInvestorKyc(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      if (page < 1 || limit < 1 || limit > 100) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      const result = await this._getAllInvestorKycUseCase.getAllInvestorsKyc(
        page,
        limit,
        status,
        search
      );
      console.log(result);

      // if (!result || result.investorsKyc?.length === 0) {
      //   throw new InvalidDataException(Errors.NO_KYC_FOUND);
      // }

      ResponseHelper.success(
        res,
        MESSAGES.KYC.FETCHED_SUCCESSFULLY,
        { data: result },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updateUserKycStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, newStatus, reason } = req.body;

      if (!userId || !newStatus) {
        throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
      }

      const result = await this._updateUserKycStatusUseCase.updateUserKycStatus(
        userId,
        newStatus,
        reason
      );

      ResponseHelper.success(
        res,
        MESSAGES.KYC.STATUS_UPDATED_SUCCESSFULLY,
        { data: result.user },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async udpateInvestorKycStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { investorId, newStatus, reason } = req.body;

      if (!investorId || !newStatus) {
        throw new InvalidDataException(Errors.INVALID_CREDENTIALS);
      }

      const result = await this._updateInvestorKycStatusUseCase.updateInvestorKycStatus(
        investorId,
        newStatus,
        reason
      );

      ResponseHelper.success(
        res,
        MESSAGES.KYC.STATUS_UPDATED_SUCCESSFULLY,
        {
          data: result.investor,
        },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
