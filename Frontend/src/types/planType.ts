import type { PlanRole } from "./planRole";
import type { ProfileBoost } from "./profileBoost";
import type { PlanStatus } from "./planStatus";

export interface Plan {
  _id: string;
  name: string;
  role: PlanRole;
  description: string;

  limits: {
    messages: number;
    consentLetters: number;
    profileBoost: ProfileBoost;
  };

  billing: {
    durationDays: number;
    price: number;
  };

  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanPayload {
  name: string;
  role: PlanRole;
  description: string;

  limits: {
    messages: number;
    consentLetters: number;
    profileBoost: ProfileBoost;
  };

  billing: {
    durationDays: number;
    price: number;
  };
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string;

  limits?: {
    messages?: number;
    consentLetters?: number;
    profileBoost?: ProfileBoost;
  };

  billing?: {
    durationDays?: number;
    price?: number;
  };
}
