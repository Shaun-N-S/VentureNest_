import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface AdminProjectRegistrationDTO {
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

  createdAt: Date;
}
