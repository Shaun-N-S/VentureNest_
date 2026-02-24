import { Document, model, Types } from "mongoose";
import projectRegistrationSchema from "../schema/projectRegistrationSchema";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface IProjectRegistrationModel extends Document {
  _id: string;

  projectId: Types.ObjectId;
  founderId: Types.ObjectId;

  gstCertificateUrl?: string;
  companyRegistrationCertificateUrl?: string;
  cinNumber?: string;

  country: string;
  declarationAccepted: boolean;

  status: ProjectRegistrationStatus;
  rejectionReason?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export const projectRegistrationModel = model<IProjectRegistrationModel>(
  "ProjectRegistration",
  projectRegistrationSchema
);
