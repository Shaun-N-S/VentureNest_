import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateInvestmentOfferPayload,
  InvestmentOfferResponse,
  SentInvestmentOfferListItem,
} from "../../../types/investmentOfferType";
import {
  createInvestmentOffer,
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
