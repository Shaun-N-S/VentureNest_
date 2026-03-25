import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";

export const getAdminWithdrawals = async (
  page = 1,
  limit = 10,
  status?: string,
  projectId?: string,
) => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.WITHDRAWALS, {
    params: { page, limit, status, projectId },
  });

  return response.data.data;
};

export const approveWithdrawal = async (id: string) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ADMIN.APPROVE_WITHDRAWAL.replace(":id", id),
  );

  return response.data;
};

export const rejectWithdrawal = async (id: string) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ADMIN.REJECT_WITHDRAWAL.replace(":id", id),
  );

  return response.data;
};
