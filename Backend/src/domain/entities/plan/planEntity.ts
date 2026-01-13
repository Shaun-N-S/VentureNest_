import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";
import { ProfileBoost } from "@domain/enum/profileBoost";

export interface PlanEntity {
  _id?: string;

  name: string;
  role: PlanRole;
  description: string;

  limits: {
    messages: number;
    consentLetters: number;
    profileBoost: ProfileBoost;
  };

  billing: {
    durationDays: number; // 30, 180, 365
    price: number; // display-only for now
  };

  status: PlanStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
