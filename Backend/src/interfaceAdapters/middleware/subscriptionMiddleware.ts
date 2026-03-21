import { SubscriptionAction } from "@domain/enum/subscriptionActions";
import { checkSubscriptionAccessUseCase } from "@infrastructure/DI/Subscription/subscriptionAccessContainer";
import { Request, Response, NextFunction } from "express";

export const subscriptionGuard = (action: SubscriptionAction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = res.locals.user.userId;
      const ownerRole = res.locals.user.role;

      await checkSubscriptionAccessUseCase.execute({
        ownerId,
        ownerRole,
        action,
      });

      next();
    } catch (err) {
      next(err);
    }
  };
};
