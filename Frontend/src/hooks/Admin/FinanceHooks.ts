import { useMutation, useQuery } from "@tanstack/react-query";
import { getAdminFinanceSummary } from "../../services/Admin/Finance/AdminFinanceService";
import { getAdminPlatformWallet } from "../../services/Admin/Finance/AdminPlatformWalletService";
import {
  approveWithdrawal,
  getAdminWithdrawals,
  rejectWithdrawal,
} from "../../services/Admin/Finance/AdminWithdrawalService";
import { queryClient } from "../../main";
import toast from "react-hot-toast";

export const useAdminFinanceSummary = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["admin-finance-summary"],
    queryFn: getAdminFinanceSummary,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useAdminPlatformWallet = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["admin-platform-wallet"],
    queryFn: getAdminPlatformWallet,
    staleTime: 1000 * 60 * 2,
    enabled,
  });
};

export const useAdminWithdrawals = (
  page: number,
  limit: number,
  status?: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ["admin-withdrawals", page, status, search],
    queryFn: () => getAdminWithdrawals(page, limit, status, search),
  });
};

export const useApproveWithdrawal = () => {
  return useMutation({
    mutationFn: (id: string) => approveWithdrawal(id),

    onSuccess: () => {
      toast.success("Withdrawal approved");

      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    },

    onError: () => {
      toast.error("Approval failed");
    },
  });
};

export const useRejectWithdrawal = () => {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectWithdrawal(id, reason),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    },

    onError: () => {
      toast.error("Rejection failed");
    },
  });
};
