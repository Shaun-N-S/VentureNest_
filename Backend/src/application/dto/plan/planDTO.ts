import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";
import { ProfileBoost } from "@domain/enum/profileBoost";

export interface PlanDTO {
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
  createdAt?: Date;
  updatedAt?: Date;
}
