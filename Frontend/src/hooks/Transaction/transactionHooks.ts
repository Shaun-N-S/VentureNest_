import { useQuery } from "@tanstack/react-query";
import { getMyWalletTransactions } from "../../services/Transaction/transactionService";
import type { TransactionAction } from "../../types/transactionTypes";

export const useMyWalletTransactions = (
  page: number,
  limit: number,
  action?: TransactionAction,
) => {
  return useQuery({
    queryKey: ["wallet-transactions", page, limit, action],
    queryFn: () => getMyWalletTransactions(page, limit, action),
  });
};
