import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";

export interface PlanDTO {
  _id: string;

  name: string;
  role: PlanRole;
  description: string;

  limits: {
    projects?: number;
    proposalsPerMonth?: number;
    investmentOffers?: number;
  };

  permissions: {
    canCreateProject: boolean;
    canSendProposal: boolean;

    canSendInvestmentOffer: boolean;
    canInvestMoney: boolean;
    canViewInvestmentDashboard: boolean;

    canStartVideoCall: boolean;
  };

  billing: {
    durationDays: number;
    price: number;
  };

  status: PlanStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
