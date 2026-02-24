import mongoose from "mongoose";

const shareIssuanceSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
    },

    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },

    sharesIssued: {
      type: Number,
      required: true,
    },

    equityPercentage: {
      type: Number,
      required: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

shareIssuanceSchema.index({ dealId: 1 });
shareIssuanceSchema.index({ projectId: 1 });

export default shareIssuanceSchema;
