import mongoose from "mongoose";
import { CertificateType } from "@domain/enum/certificateType";

const dealCertificateSchema = new mongoose.Schema(
  {
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(CertificateType),
      required: true,
    },

    data: {
      projectName: { type: String, required: true },
      amount: { type: Number, required: true },
      equityPercentage: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  },
  { timestamps: true }
);

export default dealCertificateSchema;
