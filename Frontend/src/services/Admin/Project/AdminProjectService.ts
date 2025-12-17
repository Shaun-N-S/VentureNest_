import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";

export const getAllProjects = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.PROJECTS}?${params.toString()}`
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
    }
  );
  return response.data;
};
