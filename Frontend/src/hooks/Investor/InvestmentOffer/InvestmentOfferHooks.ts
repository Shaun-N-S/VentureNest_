import { useMutation } from "@tanstack/react-query";
import type {
  CreateInvestmentOfferPayload,
  InvestmentOfferResponse,
} from "../../../types/investmentOfferType";
import { createInvestmentOffer } from "../../../services/Investor/InvestmentOfferService";
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
