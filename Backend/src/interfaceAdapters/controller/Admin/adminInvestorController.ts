import { IGetAllInvestorUseCase } from "@domain/interfaces/useCases/admin/investor/IGetAllInvestorUseCase";
import { IUpdateInvestorStatusUseCase } from "@domain/interfaces/useCases/admin/investor/IUpdateInvestorStatusUseCase";
import { Errors } from "@shared/constants/error";
import { HTTPStatus } from "@shared/constants/httpStatus";
import { Request, Response } from "express";

export class AdminInvestorController {
  constructor(
    private _getAllInvestorUseCase: IGetAllInvestorUseCase,
    private _updateInvestorStatusUseCase: IUpdateInvestorStatusUseCase
  ) {}

  async getAllInvestor(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      if (page < 1 || limit < 1 || limit > 100) {
        res.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          message: Errors.INVALID_PAGINATION_PARAMETERS,
        });
        return;
      }

      const result = await this._getAllInvestorUseCase.getAllInvestors(page, limit, status, search);
      console.log(result);

      res.status(HTTPStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log("Error in getAllInvestor: ", error);
      res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        message: Errors.FAILED_USER_FETCHING,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateInvestorStatus(req: Request, res: Response): Promise<void> {
    try {
      const { investorId, currentStatus } = req.body;

      if (!investorId || !currentStatus) {
        res.status(400).json({ message: Errors.INVALID_CREDENTIALS });
        return;
      }

      const result = await this._updateInvestorStatusUseCase.updateInvestorStatus(
        investorId,
        currentStatus
      );

      res.status(200).json({
        success: true,
        message: "User status updated successfully",
        data: result.investor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update user status",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
