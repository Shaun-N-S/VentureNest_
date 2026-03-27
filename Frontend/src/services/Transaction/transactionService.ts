import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  TransactionAction,
} from "../../types/transactionTypes";

export const getMyWalletTransactions = async (
  page = 1,
  limit = 10,
  action?: TransactionAction,
) => {
  const response = await AxiosInstance.get(API_ROUTES.TRANSACTION.MY_WALLET, {
    params: { page, limit, action },
  });

  return response.data.data;
};
