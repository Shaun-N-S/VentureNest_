import mongoose from "mongoose";
import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: Object.values(PlanRole),
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    limits: {
      // USER
      projects: {
        type: Number,
        min: 0,
      },
      proposalsPerMonth: {
        type: Number,
        min: 0,
      },
      meetingRequests: {
        type: Number,
        min: 0,
      },

      // INVESTOR
      investmentOffers: {
        type: Number,
        min: 0,
      },
      activeInvestments: {
        type: Number,
        min: 0,
      },
    },

    permissions: {
      // USER
      canCreateProject: {
        type: Boolean,
        required: true,
        default: false,
      },
      canSendProposal: {
        type: Boolean,
        required: true,
        default: false,
      },
      canRequestMeeting: {
        type: Boolean,
        required: true,
        default: false,
      },

      // INVESTOR
      canSendInvestmentOffer: {
        type: Boolean,
        required: true,
        default: false,
      },
      canInvestMoney: {
        type: Boolean,
        required: true,
        default: false,
      },
      canViewInvestmentDashboard: {
        type: Boolean,
        required: true,
        default: false,
      },
    },

    billing: {
      durationDays: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    status: {
      type: String,
      enum: Object.values(PlanStatus),
      default: PlanStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

export default planSchema;
