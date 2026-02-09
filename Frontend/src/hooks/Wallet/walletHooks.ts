import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createWalletTopupCheckout,
  getMyWallet,
  getProjectWallet,
} from "../../services/Wallet/walletService";
import type { Wallet } from "../../types/wallet";

export const useWalletTopup = () => {
  return useMutation({
    mutationFn: (amount: number) => createWalletTopupCheckout(amount),

    onSuccess: (url) => {
      window.location.href = url;
    },

    onError: (error) => {
      console.error("Wallet top-up failed", error);
      alert("Unable to add money. Please try again.");
    },
  });
};

export const useGetMyWallet = () => {
  return useQuery<Wallet>({
    queryKey: ["my-wallet"],
    queryFn: getMyWallet,
  });
};

export const useGetProjectWallet = (projectId?: string) => {
  return useQuery<Wallet>({
    queryKey: ["project-wallet", projectId],
    queryFn: () => getProjectWallet(projectId!),
    enabled: !!projectId,
  });
};
