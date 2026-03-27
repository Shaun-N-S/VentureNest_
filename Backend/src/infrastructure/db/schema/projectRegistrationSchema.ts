import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import mongoose from "mongoose";

const projectRegistrationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gstCertificateUrl: { type: String },
    companyRegistrationCertificateUrl: { type: String },

    cinNumber: { type: String },

    country: {
      type: String,
      required: true,
    },

    declarationAccepted: {
      type: Boolean,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ProjectRegistrationStatus),
      default: ProjectRegistrationStatus.PENDING,
    },

    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default projectRegistrationSchema;
