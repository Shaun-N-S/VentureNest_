import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface ProjectRegistrationResDTO {
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

export interface CreateProjectRegistrationDTO {
  project_id: string;
  founder_id: string;

  gstCertificate?: File | undefined;
  companyRegistrationCertificate?: File | undefined;

  cin_number?: string | undefined;
  country: string;

  declarationAccepted: boolean;
}

export interface CreateProjectRegistrationEntityDTO {
  project_id: string;
  founder_id: string;

  gstCertificateUrl?: string | undefined;
  companyRegistrationCertificateUrl?: string | undefined;

  cin_number?: string | undefined;
  country: string;

  declarationAccepted: boolean;

  status?: ProjectRegistrationStatus;
}
