import { useQuery } from "@tanstack/react-query";
import { getDealDetails, getDealInstallments, getMyDeals } from "../../services/Deal/dealService";
import type { DealInstallment, DealSummary } from "../../types/dealTypes";

export const useGetMyDeals = () => {
  return useQuery<DealSummary[]>({
    queryKey: ["my-deals"],
    queryFn: getMyDeals,
  });
};

export const useGetDealDetails = (dealId?: string) => {
  return useQuery({
    queryKey: ["deal-details", dealId],
    queryFn: () => getDealDetails(dealId!),
    enabled: !!dealId,
  });
};

export const useGetDealInstallments = (dealId?: string) => {
  return useQuery<DealInstallment[]>({
    queryKey: ["deal-installments", dealId],
    queryFn: () => getDealInstallments(dealId!),
    enabled: !!dealId,
  });
};
