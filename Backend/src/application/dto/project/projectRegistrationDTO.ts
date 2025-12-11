import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface ProjectRegistrationResDTO {
  _id: string;

  projectId: string;
  founderId: string;

  gstCertificateUrl?: string;
  companyRegistrationCertificateUrl?: string;
  cinNumber?: string;

  country: string;
  verifyProfile: boolean;
  declarationAccepted: boolean;

  status: ProjectRegistrationStatus;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectRegistrationDTO {
  projectId: string;
  founderId: string;

  gstCertificate?: File | undefined;
  companyRegistrationCertificate?: File | undefined;

  cinNumber?: string | undefined;
  country: string;

  declarationAccepted: boolean;
}

export interface CreateProjectRegistrationEntityDTO {
  projectId: string;
  founderId: string;

  gstCertificateUrl?: string | undefined;
  companyRegistrationCertificateUrl?: string | undefined;

  cinNumber?: string | undefined;
  country: string;

  declarationAccepted: boolean;

  status?: ProjectRegistrationStatus;
}
