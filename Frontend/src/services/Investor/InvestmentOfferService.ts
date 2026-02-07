import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  AcceptInvestmentOfferResponse,
  CreateInvestmentOfferPayload,
  InvestmentOfferDetails,
  InvestmentOfferResponse,
  ReceivedInvestmentOfferListItem,
  RejectInvestmentOfferResponse,
  SentInvestmentOfferListItem,
} from "../../types/investmentOfferType";
import type { PaginatedResponses } from "../../types/pagination";

export const createInvestmentOffer = async (
  payload: CreateInvestmentOfferPayload,
): Promise<InvestmentOfferResponse> => {
  const { data } = await AxiosInstance.post(API_ROUTES.OFFERS.CREATE, payload, {
    withCredentials: true,
  });

  return data.data;
};

export const fetchSentInvestmentOffers = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
): Promise<PaginatedResponses<SentInvestmentOfferListItem>> => {
  const { data } = await AxiosInstance.get(API_ROUTES.OFFERS.SENT, {
    params: { page, limit, status, search },
    withCredentials: true,
  });

  return data.data;
};

export const fetchReceivedInvestmentOffers = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
): Promise<PaginatedResponses<ReceivedInvestmentOfferListItem>> => {
  const { data } = await AxiosInstance.get(API_ROUTES.OFFERS.RECEIVED, {
    params: { page, limit, status, search },
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

export const rejectInvestmentOffer = async (
  offerId: string,
  reason: string,
): Promise<RejectInvestmentOfferResponse> => {
  const { data } = await AxiosInstance.patch(
    API_ROUTES.OFFERS.REJECT.replace(":offerId", offerId),
    { reason },
    { withCredentials: true },
  );

  return data.data;
};
