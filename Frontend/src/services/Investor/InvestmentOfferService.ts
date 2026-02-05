import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  CreateInvestmentOfferPayload,
  InvestmentOfferResponse,
} from "../../types/investmentOfferType";

export const createInvestmentOffer = async (
  payload: CreateInvestmentOfferPayload,
): Promise<InvestmentOfferResponse> => {
  const { data } = await AxiosInstance.post(API_ROUTES.OFFERS.CREATE, payload, {
    withCredentials: true,
  });

  return data.data;
};
