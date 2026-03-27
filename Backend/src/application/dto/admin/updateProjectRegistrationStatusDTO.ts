import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export interface UpdateProjectRegistrationStatusDTO {
  registrationId: string;
  status: ProjectRegistrationStatus;
  reason?: string;
}
