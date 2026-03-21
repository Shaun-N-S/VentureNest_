// import { PlanRole } from "@domain/enum/planRole";
// import { PlanStatus } from "@domain/enum/planStatus";

// export interface PlanEntity {
//   _id?: string;

//   name: string;
//   role: PlanRole;
//   description: string;

//   limits: {
//     // USER (Founder)
//     projects?: number;
//     proposalsPerMonth?: number;
//     meetingRequests?: number; //

//     // INVESTOR
//     investmentOffers?: number;
//     activeInvestments?: number; //
//   };

//   permissions: {
//     // USER
//     canCreateProject: boolean;
//     canSendProposal: boolean;
//     canRequestMeeting: boolean;

//     // INVESTOR
//     canSendInvestmentOffer: boolean;
//     canInvestMoney: boolean;
//     canViewInvestmentDashboard: boolean;
//   };

//   billing: {
//     durationDays: number;
//     price: number;
//   };

//   status: PlanStatus;

//   createdAt?: Date;
//   updatedAt?: Date;
// }

import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";

export interface PlanEntity {
  _id?: string;

  name: string;
  role: PlanRole;
  description: string;

  limits: {
    // USER (Founder)
    projects?: number; // -1 => unlimited
    proposalsPerMonth?: number; // -1 => unlimited

    // INVESTOR
    investmentOffers?: number; // -1 => unlimited
  };

  permissions: {
    // USER (Founder)
    canCreateProject: boolean;
    canSendProposal: boolean;

    // INVESTOR
    canSendInvestmentOffer: boolean;
    canInvestMoney: boolean;
    canViewInvestmentDashboard: boolean;

    // COMMON (Both Founder & Investor)
    canStartVideoCall: boolean;
  };

  billing: {
    durationDays: number;
    price: number;
  };

  status: PlanStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
