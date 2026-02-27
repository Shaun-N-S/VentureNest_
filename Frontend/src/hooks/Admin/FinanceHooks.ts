import { useQuery } from "@tanstack/react-query";
import { getAdminFinanceSummary } from "../../services/Admin/Finance/AdminFinanceService";
import { getAdminPlatformWallet } from "../../services/Admin/Finance/AdminPlatformWalletService";

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
