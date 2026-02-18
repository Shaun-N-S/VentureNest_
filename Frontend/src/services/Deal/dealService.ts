import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { DealInstallment, DealSummary } from "../../types/dealTypes";

export const getMyDeals = async (): Promise<DealSummary[]> => {
  const response = await AxiosInstance.get(API_ROUTES.DEAL.GET_MY_DEALS);

  return response.data.data;
};

export const getDealDetails = async (dealId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.DEAL.GET_BY_ID.replace(":dealId", dealId),
  );

  return response.data.data;
};

export const getDealInstallments = async (
  dealId: string,
): Promise<DealInstallment[]> => {
  const response = await AxiosInstance.get(
    API_ROUTES.DEAL.GET_INSTALLMENTS.replace(":dealId", dealId),
  );

  return response.data.data;
};
