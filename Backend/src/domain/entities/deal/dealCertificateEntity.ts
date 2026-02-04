import { CertificateType } from "@domain/enum/certificateType";

export interface DealCertificateEntity {
  _id?: string;

  dealId: string;
  userId: string;

  type: CertificateType;
  data: {
    projectName: string;
    amount: number;
    equityPercentage: number;
    date: Date;
  };

  createdAt?: Date;
}
