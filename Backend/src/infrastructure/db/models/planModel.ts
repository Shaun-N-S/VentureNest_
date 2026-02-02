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
    meetingRequests?: number;

    // INVESTOR
    investmentOffers?: number;
    activeInvestments?: number;
  };

  permissions: {
    // USER
    canCreateProject: boolean;
    canSendProposal: boolean;
    canRequestMeeting: boolean;

    // INVESTOR
    canSendInvestmentOffer: boolean;
    canInvestMoney: boolean;
    canViewInvestmentDashboard: boolean;
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
