import { PlanRole } from "@domain/enum/planRole";

export interface CreatePlanDTO {
  name: string;
  role: PlanRole;
  description: string;

  limits: {
    projects?: number;
    proposalsPerMonth?: number;
    meetingRequests?: number;
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
}
