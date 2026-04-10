import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createDealInstallmentCheckout,
  getDealDetails,
  getDealInstallments,
  getMyDeals,
  releaseDealInstallment,
} from "../../services/Deal/dealService";
import type { DealInstallment, DealSummary } from "../../types/dealTypes";
import toast from "react-hot-toast";

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

export const useCreateDealInstallmentCheckout = () => {
  return useMutation({
    mutationFn: ({ dealId, amount }: { dealId: string; amount: number }) =>
      createDealInstallmentCheckout(dealId, amount),

    onSuccess: (url) => {
      window.location.href = url;
    },

    onError: (error) => {
      console.error("Installment checkout failed", error);
      toast.error("Unable to initiate payment. Please try again.");
    },
  });
};

export const useReleaseDealInstallment = () => {
  return useMutation<void, Error, { dealId: string; amount: number }>({
    mutationFn: ({ dealId, amount }) => releaseDealInstallment(dealId, amount),

    onSuccess: () => {
      toast.success("Installment released successfully ");
    },

    onError: (error) => {
      console.error("Release installment failed:", error.message);
      toast.error("Failed to release installment.");
    },
  });
};
