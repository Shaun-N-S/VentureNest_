import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  AcceptInvestmentOfferResponse,
  CreateInvestmentOfferPayload,
  InvestmentOfferDetails,
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

export const fetchInvestmentOfferDetails = async (
  offerId: string,
): Promise<InvestmentOfferDetails> => {
  const { data } = await AxiosInstance.get(
    API_ROUTES.OFFERS.GET_BY_ID.replace(":offerId", offerId),
    { withCredentials: true },
  );

  return data.data;
};

export const acceptInvestmentOffer = async (
  offerId: string,
): Promise<AcceptInvestmentOfferResponse> => {
  const { data } = await AxiosInstance.patch(
    API_ROUTES.OFFERS.ACCEPT.replace(":offerId", offerId),
    {},
    { withCredentials: true },
  );

  return data.data;
};
