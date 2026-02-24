import mongoose from "mongoose";
import { DealStatus } from "@domain/enum/dealStatus";
import { InvestmentType } from "@domain/enum/investmentType";
import { ConversionStatus } from "@domain/enum/conversionStatus";

const dealSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentOffer",
      required: true,
      unique: true,
    },

    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      required: true,
    },

    equityPercentage: {
      type: Number,
      required: true,
    },

    equityAllocated: {
      type: Number,
      default: 0,
    },

    investmentType: {
      type: String,
      enum: Object.values(InvestmentType),
      required: true,
    },

    conversionStatus: {
      type: String,
      enum: Object.values(ConversionStatus),
      default: ConversionStatus.NOT_REQUIRED,
    },

    status: {
      type: String,
      enum: Object.values(DealStatus),
      default: DealStatus.AWAITING_PAYMENT,
    },
  },
  { timestamps: true }
);

export default dealSchema;
