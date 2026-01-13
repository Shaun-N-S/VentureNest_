import { Document, model } from "mongoose";
import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";
import { ProfileBoost } from "@domain/enum/profileBoost";
import planSchema from "../schema/planSchema";

export interface IPlanModel extends Document {
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

  createdAt: Date;
  updatedAt: Date;
}

export const planModel = model<IPlanModel>("Plan", planSchema);
