import { IApproveWithdrawalUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IApproveWithdrawalUseCase";
import { IGetWithdrawalsUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IGetWithdrawalsUseCase";
import { IRejectWithdrawalUseCase } from "@domain/interfaces/useCases/admin/finance/withdrawal/IRejectWithdrawalUseCase";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { NextFunction, Request, Response } from "express";
import { InvalidDataException } from "application/constants/exceptions";
import { WithdrawalStatus } from "@domain/enum/WithdrawalStatus";
import { GetWithdrawalsRequestDTO } from "application/dto/wallet/getWithdrawalsDTO";
import { Errors, WALLET_ERRORS } from "@shared/constants/error";
import { MESSAGES } from "@shared/constants/messages";

export class AdminWithdrawalController {
  constructor(
    private _approveUseCase: IApproveWithdrawalUseCase,
    private _rejectUseCase: IRejectWithdrawalUseCase,
    private _getUseCase: IGetWithdrawalsUseCase
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = "1", limit = "10", status, projectId, search } = req.query;

      const parsedPage = Number(page);
      const parsedLimit = Number(limit);

      if (isNaN(parsedPage) || parsedPage <= 0) {
        throw new InvalidDataException(Errors.INVALID_PAGINATION_PARAMETERS);
      }

      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        throw new InvalidDataException(Errors.INVALID_LIMIT);
      }

      let parsedStatus: WithdrawalStatus | undefined;

      if (status) {
        if (!Object.values(WithdrawalStatus).includes(status as WithdrawalStatus)) {
          throw new InvalidDataException(WALLET_ERRORS.INVALID_WITHDRAWAL_STATUS);
        }

        parsedStatus = status as WithdrawalStatus;
      }

      const dto: GetWithdrawalsRequestDTO = {
        page: parsedPage,
        limit: parsedLimit,
        ...(parsedStatus && { status: parsedStatus }),
        ...(typeof projectId === "string" && projectId && { projectId }),
        ...(typeof search === "string" && search.trim() && { search }),
      };

      const result = await this._getUseCase.execute(dto);

      ResponseHelper.success(res, MESSAGES.WALLET.WITHDRAWAL_FETCHED, result, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      await this._approveUseCase.execute(id);

      ResponseHelper.success(res, MESSAGES.WALLET.WITHDRAWAL_APPROVED, null, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!id) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      if (!reason || reason.trim().length < 3) {
        throw new InvalidDataException(WALLET_ERRORS.WITHDRAWAL_REJECT_REASON_REQUIRED);
      }

      await this._rejectUseCase.execute(id, reason);

      ResponseHelper.success(res, MESSAGES.WALLET.WITHDRAWAL_REJECTED, null, HTTPSTATUS.OK);
    } catch (err) {
      next(err);
    }
  }
}
