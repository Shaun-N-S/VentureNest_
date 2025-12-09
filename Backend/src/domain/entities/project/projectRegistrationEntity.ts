import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface ProjectRegistrationEntity {
  _id?: string;
  project_id: string;
  founder_id: string;
  gstCertificateUrl?: string;
  companyRegistrationCertificateUrl?: string;
  cin_number?: string;
  country: string;
  verifyProfile: boolean;
  declarationAccepted: boolean;
  status: ProjectRegistrationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
