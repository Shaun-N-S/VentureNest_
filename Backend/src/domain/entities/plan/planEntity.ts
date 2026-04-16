import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";

export interface PlanEntity {
  _id?: string;

  name: string;
  role: PlanRole;
  description: string;

  limits: {
    // USER (Founder)
    projects?: number;
    proposalsPerMonth?: number;

    // INVESTOR
    investmentOffers?: number;
  };

  permissions: {
    // USER (Founder)
    canCreateProject: boolean;
    canSendProposal: boolean;

    // INVESTOR
    canSendInvestmentOffer: boolean;
    canInvestMoney: boolean;
    canViewInvestmentDashboard: boolean;

    // COMMON (Both Founder & Investor)
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
