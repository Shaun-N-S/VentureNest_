import { PlanRole } from "@domain/enum/planRole";

export interface CreatePlanDTO {
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
}
