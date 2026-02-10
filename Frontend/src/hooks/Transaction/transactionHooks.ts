import { useQuery } from "@tanstack/react-query";
import { getMyWalletTransactions } from "../../services/Transaction/transactionService";
import type { Transaction, TransactionAction } from "../../types/transactionTypes";


export const useMyWalletTransactions = (action?: TransactionAction) => {
  return useQuery<Transaction[]>({
    queryKey: ["wallet-transactions", action],
    queryFn: () => getMyWalletTransactions(action),
  });
};
