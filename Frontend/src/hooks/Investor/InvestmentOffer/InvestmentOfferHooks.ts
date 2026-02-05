import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateInvestmentOfferPayload,
  InvestmentOfferDetails,
  InvestmentOfferResponse,
  ReceivedInvestmentOfferListItem,
  SentInvestmentOfferListItem,
} from "../../../types/investmentOfferType";
import {
  createInvestmentOffer,
  fetchInvestmentOfferDetails,
  fetchReceivedInvestmentOffers,
  fetchSentInvestmentOffers,
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

export const useFetchSentInvestmentOffers = () => {
  return useQuery<SentInvestmentOfferListItem[]>({
    queryKey: ["sent-investment-offers"],
    queryFn: fetchSentInvestmentOffers,
  });
};

export const useFetchReceivedInvestmentOffers = () => {
  return useQuery<ReceivedInvestmentOfferListItem[]>({
    queryKey: ["received-investment-offers"],
    queryFn: fetchReceivedInvestmentOffers,
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
