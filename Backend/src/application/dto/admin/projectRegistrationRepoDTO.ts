import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface PopulatedProjectRegistrationRepoDTO {
  _id: string;

  projectId: {
    _id: string;
    startupName: string;
    logoUrl?: string;
    coverImageUrl?: string;
  };

  founderId: {
    _id: string;
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
