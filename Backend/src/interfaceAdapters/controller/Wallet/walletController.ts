import { Request, Response, NextFunction } from "express";
import { IGetWalletDetailsUseCase } from "@domain/interfaces/useCases/wallet/IGetWalletDetailsUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { HTTPSTATUS } from "@shared/constants/httpStatus";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { InvalidDataException } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { MESSAGES } from "@shared/constants/messages";
import { ICreateWalletTopupCheckoutUseCase } from "@domain/interfaces/useCases/wallet/ICreateWalletTopupCheckoutUseCase";

export class WalletController {
  constructor(
    private _getWalletDetailsUseCase: IGetWalletDetailsUseCase,
    private _createWalletTopupCheckoutUseCase: ICreateWalletTopupCheckoutUseCase
  ) {}

  async getMyWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.user;

      if (!userId || !role) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const ownerType = role === "INVESTOR" ? WalletOwnerType.INVESTOR : WalletOwnerType.USER;

      const wallet = await this._getWalletDetailsUseCase.execute({
        ownerType,
        ownerId: userId,
      });

      ResponseHelper.success(res, MESSAGES.WALLET.WALLET_FETCHED, wallet, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getProjectWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const wallet = await this._getWalletDetailsUseCase.execute({
        ownerType: WalletOwnerType.PROJECT,
        ownerId: projectId,
      });

      ResponseHelper.success(res, MESSAGES.WALLET.WALLET_FETCHED, wallet, HTTPSTATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async createWalletTopupCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.user;
      const { amount } = req.body;

      if (!userId || !role || !amount || amount <= 0) {
        throw new InvalidDataException(Errors.INVALID_DATA);
      }

      const checkoutUrl = await this._createWalletTopupCheckoutUseCase.execute(
        userId,
        role,
        amount
      );

      ResponseHelper.success(
        res,
        MESSAGES.WALLET.WALLET_TOPUP_CREATED,
        { url: checkoutUrl },
        HTTPSTATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}
