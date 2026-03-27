import type { ProjectRegistrationStatus } from "./projectRegistrationStatus";

export interface AdminProjectRegistration {
  registrationId: string;

  project: {
    projectId: string;
    startupName: string;
    logoUrl?: string;
    coverImageUrl?: string;
  };

  founder: {
    founderId: string;
    userName: string;
    profileImg?: string;
  };

  gstCertificateUrl?: string;
  companyRegistrationCertificateUrl?: string;
  cinNumber?: string;

  country: string;
  declarationAccepted: boolean;

  status: ProjectRegistrationStatus;
  rejectionReason?: string | null;

  createdAt: string;
}
