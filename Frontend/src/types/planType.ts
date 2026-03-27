import type { PlanRole } from "./planRole";
import type { PlanStatus } from "./planStatus";

export interface Plan {
  _id: string;
  name: string;
  role: PlanRole;
  description: string;

  limits: {
    projects: number;
    proposalsPerMonth: number;
    investmentOffers: number;
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
  createdAt: string;
  updatedAt: string;
}

/* ---------- Payloads ---------- */

export interface CreatePlanPayload {
  name: string;
  role: PlanRole;
  description: string;

  limits: {
    projects: number;
    proposalsPerMonth: number;
    investmentOffers: number;
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

export interface UpdatePlanPayload {
  name?: string;
  description?: string;
  limits?: Partial<Plan["limits"]>;
  permissions?: Partial<Plan["permissions"]>;
  billing?: Partial<Plan["billing"]>;
}

export interface PaginatedPlansExplaination {
  plans: Plan[];
  total: number;
}
