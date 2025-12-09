import { Document, model } from "mongoose";
import projectRegistrationSchema from "../schema/projectRegistrationSchema";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface IProjectRegistrationModel extends Document {
  _id: string;
  project_id: string;
  founder_id: string;

  gstCertificateUrl?: string;
  companyRegistrationCertificateUrl?: string;
  cin_number?: string;

  country: string;
  verifyProfile: boolean;
  declarationAccepted: boolean;

  status: ProjectRegistrationStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const projectRegistrationModel = model<IProjectRegistrationModel>(
  "ProjectRegistration",
  projectRegistrationSchema
);
