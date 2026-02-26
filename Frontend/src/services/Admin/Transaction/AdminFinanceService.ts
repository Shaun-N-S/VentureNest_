import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";
import type { AdminTransactionResponse } from "../../../types/adminTransactionTypes";

export const getAdminTransactions = async (
  page = 1,
  limit = 10,
  reason?: string,
  action?: string,
  status?: string,
  dealId?: string,
): Promise<AdminTransactionResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (reason) params.append("reason", reason);
  if (action) params.append("action", action);
  if (status) params.append("status", status);
  if (dealId) params.append("dealId", dealId);

  const response = await AxiosInstance.get(
    `${API_ROUTES.ADMIN.TRANSACTIONS}?${params.toString()}`,
  );

  return response.data.data;
};
