import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface ProjectRegistrationEntity {
  _id?: string;
  projectId: string;
  founderId: string;

  gstCertificateUrl?: string;
  companyRegistrationCertificateUrl?: string;
  cinNumber?: string;

  country: string;
  declarationAccepted: boolean;

  status: ProjectRegistrationStatus;
  rejectionReason?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}
