import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  AcceptInvestmentOfferResponse,
  CreateInvestmentOfferPayload,
  InvestmentOfferDetails,
  InvestmentOfferResponse,
  RejectInvestmentOfferPayload,
  RejectInvestmentOfferResponse,
} from "../../../types/investmentOfferType";
import {
  acceptInvestmentOffer,
  createInvestmentOffer,
  fetchInvestmentOfferDetails,
  fetchReceivedInvestmentOffers,
  fetchSentInvestmentOffers,
  rejectInvestmentOffer,
} from "../../../services/Investor/InvestmentOfferService";
import { queryClient } from "../../../main";

export const useCreateInvestmentOffer = () => {
  return useMutation<
    InvestmentOfferResponse,
    Error,
    CreateInvestmentOfferPayload
  >({
    mutationFn: createInvestmentOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sent-offers"] });
      queryClient.invalidateQueries({ queryKey: ["pitch-details"] });
    },
  });
};

export const useFetchSentInvestmentOffers = (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ["sent-investment-offers", page, limit, status, search],
    queryFn: () => fetchSentInvestmentOffers(page, limit, status, search),
  });
};

export const useFetchReceivedInvestmentOffers = (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ["received-investment-offers", page, limit, status, search],
    queryFn: () => fetchReceivedInvestmentOffers(page, limit, status, search),
  });
};

export const useFetchInvestmentOfferDetails = (
  offerId: string,
  enabled = true,
) => {
  return useQuery<InvestmentOfferDetails>({
    queryKey: ["investment-offer-details", offerId],
    queryFn: () => fetchInvestmentOfferDetails(offerId),
    enabled: Boolean(offerId) && enabled,
  });
};

export const useAcceptInvestmentOffer = () => {
  return useMutation<AcceptInvestmentOfferResponse, Error, string>({
    mutationFn: (offerId) => acceptInvestmentOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["received-investment-offers"],
      });
      queryClient.invalidateQueries({ queryKey: ["sent-investment-offers"] });
      queryClient.invalidateQueries({ queryKey: ["investment-offer-details"] });
    },
  });
};

export const useRejectInvestmentOffer = () => {
  return useMutation<
    RejectInvestmentOfferResponse,
    Error,
    RejectInvestmentOfferPayload
  >({
    mutationFn: ({ offerId, reason }) => rejectInvestmentOffer(offerId, reason),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["received-investment-offers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sent-investment-offers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["investment-offer-details"],
      });
    },
  });
};
