import { UserRole } from "@domain/enum/userRole";
import { authMiddleware } from "@infrastructure/DI/Auth/authContainer";

export const authGuard = [authMiddleware.verify, authMiddleware.checkStatus];

export const adminGuard = [...authGuard, authMiddleware.authorizeRole([UserRole.ADMIN])];

export const userGuard = [...authGuard, authMiddleware.authorizeRole([UserRole.USER])];

export const investorGuard = [...authGuard, authMiddleware.authorizeRole([UserRole.INVESTOR])];

export const userOrInvestorGuard = [
  ...authGuard,
  authMiddleware.authorizeRole([UserRole.USER, UserRole.INVESTOR]),
];
