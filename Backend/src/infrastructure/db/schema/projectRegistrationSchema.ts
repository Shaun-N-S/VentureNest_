import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import mongoose from "mongoose";

const projectRegistrationSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    founder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gstCertificateUrl: { type: String },
    companyRegistrationCertificateUrl: { type: String },
    cin_number: { type: String },

    country: { type: String, required: true },

    verifyProfile: { type: Boolean, default: false },

    declarationAccepted: { type: Boolean, required: true },

    status: {
      type: String,
      enum: Object.values(ProjectRegistrationStatus),
      default: ProjectRegistrationStatus.PENDING,
    },
  },
  { timestamps: true }
);

export default projectRegistrationSchema;
