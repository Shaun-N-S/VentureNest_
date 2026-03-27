import { Document, model } from "mongoose";
import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";
import planSchema from "../schema/planSchema";

export interface IPlanModel extends Document {
  _id: string;

  name: string;
  role: PlanRole;
  description: string;

  limits: {
    // USER
    projects?: number;
    proposalsPerMonth?: number;

    // INVESTOR
    investmentOffers?: number;
  };

  permissions: {
    // USER
    canCreateProject: boolean;
    canSendProposal: boolean;

    // INVESTOR
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

  createdAt: Date;
  updatedAt: Date;
}

export const planModel = model<IPlanModel>("Plan", planSchema);
