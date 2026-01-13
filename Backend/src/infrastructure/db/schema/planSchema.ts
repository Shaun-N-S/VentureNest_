import mongoose from "mongoose";
import { PlanRole } from "@domain/enum/planRole";
import { PlanStatus } from "@domain/enum/planStatus";
import { ProfileBoost } from "@domain/enum/profileBoost";

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
    },

    limits: {
      messages: {
        type: Number,
        required: true,
        min: 0,
      },
      consentLetters: {
        type: Number,
        required: true,
        min: 0,
      },
      profileBoost: {
        type: String,
        enum: Object.values(ProfileBoost),
        required: true,
      },
    },

    billing: {
      durationDays: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
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
