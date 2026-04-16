import { SubscriptionAction } from "@domain/enum/subscriptionActions";
import { checkSubscriptionAccessUseCase } from "@infrastructure/DI/Subscription/subscriptionAccessContainer";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "@domain/enum/userRole";

export const subscriptionGuard = (action: SubscriptionAction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = res.locals.user.userId;
      const ownerRole = res.locals.user.role as UserRole;

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
