import { Document, model } from "mongoose";
import dealCertificateSchema from "../schema/dealCertificateSchema";
import { CertificateType } from "@domain/enum/certificateType";

export interface IDealCertificateModel extends Document {
  dealId: string;
  userId: string;
  type: CertificateType;
  data: {
    projectName: string;
    amount: number;
    equityPercentage: number;
    date: Date;
  };
  createdAt: Date;
}

export const dealCertificateModel = model<IDealCertificateModel>(
  "DealCertificate",
  dealCertificateSchema
);
