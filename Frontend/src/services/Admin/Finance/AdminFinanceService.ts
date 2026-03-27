import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";
import type { AdminFinanceSummary } from "../../../types/adminFinanceTypes";

export const getAdminFinanceSummary =
  async (): Promise<AdminFinanceSummary> => {
    const response = await AxiosInstance.get(API_ROUTES.ADMIN.FINANCE_SUMMARY);

    return response.data.data;
  };
