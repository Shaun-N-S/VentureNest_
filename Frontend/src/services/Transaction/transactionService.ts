import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  Transaction,
  TransactionAction,
} from "../../types/transactionTypes";

export const getMyWalletTransactions = async (
  action?: TransactionAction,
): Promise<Transaction[]> => {
  const response = await AxiosInstance.get(API_ROUTES.TRANSACTION.MY_WALLET, {
    params: action ? { action } : {},
  });

  return response.data.data;
};
