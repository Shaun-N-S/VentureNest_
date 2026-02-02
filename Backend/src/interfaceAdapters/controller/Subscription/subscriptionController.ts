import { Request, Response, NextFunction } from "express";
import { ICreateCheckoutSessionUseCase } from "@domain/interfaces/useCases/payment/ICreateCheckoutSessionUseCase";
import { ResponseHelper } from "@shared/utils/responseHelper";
import { InvalidDataException } from "application/constants/exceptions";
import { PLAN_ERRORS } from "@shared/constants/error";
import { MESSAGES } from "@shared/constants/messages";

export class SubscriptionController {
  constructor(private _checkoutUC: ICreateCheckoutSessionUseCase) {}

  createCheckout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = res.locals.user.id;
      const ownerRole = res.locals.user.role;
      const { planId } = req.body;

      if (!planId) {
        throw new InvalidDataException(PLAN_ERRORS.PLAN_ID_MISSING);
      }

      const url = await this._checkoutUC.execute(ownerId, ownerRole, planId);

      ResponseHelper.success(res, MESSAGES.CHECKOUT_CREATED, { url });
    } catch (err) {
      next(err);
    }
  };
}
