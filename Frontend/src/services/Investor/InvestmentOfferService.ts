import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  CreateInvestmentOfferPayload,
  InvestmentOfferResponse,
  ReceivedInvestmentOfferListItem,
  SentInvestmentOfferListItem,
} from "../../types/investmentOfferType";

export const createInvestmentOffer = async (
  payload: CreateInvestmentOfferPayload,
): Promise<InvestmentOfferResponse> => {
  const { data } = await AxiosInstance.post(API_ROUTES.OFFERS.CREATE, payload, {
    withCredentials: true,
  });

  return data.data;
};

export const fetchSentInvestmentOffers = async (): Promise<
  SentInvestmentOfferListItem[]
> => {
  const response = await AxiosInstance.get(API_ROUTES.OFFERS.SENT, {
    withCredentials: true,
  });

  return response.data.data;
};

export const fetchReceivedInvestmentOffers = async (): Promise<
  ReceivedInvestmentOfferListItem[]
> => {
  const { data } = await AxiosInstance.get(API_ROUTES.OFFERS.RECEIVED, {
    withCredentials: true,
  });

  return data.data;
};
