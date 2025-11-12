import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";

export const getAllUsers = async (
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
    `${API_ROUTES.ADMIN.USERS}?${params.toString()}`
  );
  return response.data;
};

export const updateUserStatus = async ({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) => {
  const response = await AxiosInstance.post(
    API_ROUTES.ADMIN.USERS_UPDATE_STATUS,
    {
      userId,
      currentStatus,
    }
  );
  return response.data;
};
