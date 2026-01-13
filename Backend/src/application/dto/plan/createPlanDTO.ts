import { PlanRole } from "@domain/enum/planRole";
import { ProfileBoost } from "@domain/enum/profileBoost";

export interface CreatePlanDTO {
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
