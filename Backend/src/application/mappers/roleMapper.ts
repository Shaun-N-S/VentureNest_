import { PlanRole } from "@domain/enum/planRole";
import { UserRole } from "@domain/enum/userRole";

export const mapUserRoleToPlanRole = (role: UserRole): PlanRole | null => {
  switch (role) {
    case UserRole.USER:
      return PlanRole.USER;

    case UserRole.INVESTOR:
      return PlanRole.INVESTOR;

    default:
      return null; // ADMIN or unsupported roles
  }
};
