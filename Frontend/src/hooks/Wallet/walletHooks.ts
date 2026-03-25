import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createWalletTopupCheckout,
  getMyWallet,
  getProjectWallet,
  getProjectWithdrawals,
  requestWithdrawal,
} from "../../services/Wallet/walletService";
import type { Wallet } from "../../types/wallet";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import { AxiosError } from "axios";

export const useWalletTopup = () => {
  return useMutation({
    mutationFn: (amount: number) => createWalletTopupCheckout(amount),

    onSuccess: (url) => {
      window.location.href = url;
    },

    onError: (error) => {
      console.error("Wallet top-up failed", error);
      toast.error("Unable to add money. Please try again.");
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

export const useRequestWithdrawal = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      amount,
      reason,
    }: {
      projectId: string;
      amount: number;
      reason: string;
    }) => requestWithdrawal(projectId, amount, reason),

    onSuccess: (_, variables) => {
      toast.success("Withdrawal requested");

      queryClient.invalidateQueries({
        queryKey: ["project-withdrawals", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["project-wallet", variables.projectId],
      });
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(
          err?.response?.data?.message || "Failed to request withdrawal",
        );
      }
    },
  });
};

export const useGetProjectWithdrawals = (
  projectId?: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: ["project-withdrawals", projectId, page],
    queryFn: () => getProjectWithdrawals(projectId!, page, limit),
    enabled: !!projectId,
  });
};
