import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { Wallet } from "../../types/wallet";

export const createWalletTopupCheckout = async (amount: number) => {
  const response = await AxiosInstance.post(API_ROUTES.WALLET.TOPUP_CHECKOUT, {
    amount,
  });

  return response.data.data.url as string;
};

export const getMyWallet = async (): Promise<Wallet> => {
  const response = await AxiosInstance.get(API_ROUTES.WALLET.GET_MY_WALLET);
  return response.data.data;
};

export const getProjectWallet = async (projectId: string): Promise<Wallet> => {
  const response = await AxiosInstance.get(
    API_ROUTES.WALLET.GET_PROJECT_WALLET.replace(":projectId", projectId),
  );
  return response.data.data;
};
