import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";

export interface PlanDTO {
  _id: string;

  name: string;
  role: PlanRole;
  description: string;

  limits: {
    // USER
    projects?: number;
    proposalsPerMonth?: number;
    meetingRequests?: number;

    // INVESTOR
    investmentOffers?: number;
    activeInvestments?: number;
  };

  permissions: {
    canCreateProject: boolean;
    canSendProposal: boolean;
    canRequestMeeting: boolean;

    canSendInvestmentOffer: boolean;
    canInvestMoney: boolean;
    canViewInvestmentDashboard: boolean;
  };

  billing: {
    durationDays: number;
    price: number;
  };

  status: PlanStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
