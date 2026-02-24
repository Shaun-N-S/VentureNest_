import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";
import type { ApiResponse } from "../../../types/apiResponseType";
import type { ProjectRegistrationStatus } from "../../../types/projectRegistrationStatus";
import type {
  AdminProjectRegistrationDTO,
  GetAllProjectRegistrationsResponse,
} from "../../../types/projectRegistrationTypes";

export const getAllProjects = async (
  page = 1,
  limit = 10,
  status?: string,
  stage?: string,
  sector?: string,
  search?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) params.append("status", status);
  if (search) params.append("search", search);
  if (stage) params.append("stage", stage);
  if (sector) params.append("sector", sector);

  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.PROJECTS}?${params.toString()}`,
  );
  return response.data;
};

export const updateProjectStatus = async ({
  projectId,
  currentStatus,
}: {
  projectId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ADMIN.PROJECTS_UPDATE_STATUS,
    {
      projectId,
      currentStatus,
    },
  );
  return response.data;
};

export const getAllProjectRegistrations = async (
  page: number = 1,
  limit: number = 10,
  status?: ProjectRegistrationStatus,
): Promise<GetAllProjectRegistrationsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    params.append("status", status);
  }

  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.PROJECT_REGISTRATIONS}?${params.toString()}`,
  );

  return response.data.data.result; // ✅ FIXED
};

export interface UpdateProjectRegistrationStatusPayload {
  registrationId: string;
  status: ProjectRegistrationStatus;
  reason?: string;
}

export const updateProjectRegistrationStatus = async (
  payload: UpdateProjectRegistrationStatusPayload,
): Promise<AdminProjectRegistrationDTO> => {
  const { registrationId, ...body } = payload;

  const response = await AxiosInstance.patch<
    ApiResponse<{ data: AdminProjectRegistrationDTO }>
  >(
    `${API_ROUTES.ADMIN.PROJECT_REGISTRATIONS_UPDATE_STATUS}/${registrationId}`,
    body,
  );

  return response.data.data.data;
};
