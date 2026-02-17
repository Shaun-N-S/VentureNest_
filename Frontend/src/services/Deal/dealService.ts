import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { DealSummary } from "../../types/dealTypes";

export const getMyDeals = async (): Promise<DealSummary[]> => {
  const response = await AxiosInstance.get(API_ROUTES.DEAL.GET_MY_DEALS);

  return response.data.data;
};
