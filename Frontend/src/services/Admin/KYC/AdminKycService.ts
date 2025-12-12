import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";

export const getAllUsersKyc = async (
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
    `${API_ROUTES.ADMIN.FETCH_USERS_KYC}?${params.toString()}`
  );
  return response.data;
};

export const getAllInvestorsKyc = async (
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
    `${API_ROUTES.ADMIN.FETCH_INVESTORS_KYC}?${params.toString()}`
  );
  return response.data;
};

export const updateUserKycStatus = async ({
  userId,
  newStatus,
  reason,
}: {
  userId: string;
  newStatus: string;
  reason?: string;
}) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ADMIN.UPDATE_USERS_KYC,
    { userId, newStatus, reason }
  );
  return response.data;
};

export const updateInvestorKycStatus = async ({
  investorId,
  newStatus,
  reason,
}: {
  investorId: string;
  newStatus: string;
  reason?: string;
}) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ADMIN.UPDATE_INVESTORS_KYC,
    { investorId, newStatus, reason }
  );
  return response.data;
};
