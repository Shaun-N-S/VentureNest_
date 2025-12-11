import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface ProjectRegistrationEntity {
  _id?: string;
  projectId: string;
  founderId: string;
  gstCertificateUrl?: string;
  companyRegistrationCertificateUrl?: string;
  cinNumber?: string;
  country: string;
  verifyProfile: boolean;
  declarationAccepted: boolean;
  status: ProjectRegistrationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
