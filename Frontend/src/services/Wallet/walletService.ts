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

export const requestWithdrawal = async (
  projectId: string,
  amount: number,
  requestReason: string,
) => {
  const response = await AxiosInstance.post(
    API_ROUTES.WALLET.REQUEST_WITHDRAWAL,
    {
      projectId,
      amount,
      requestReason,
    },
  );

  return response.data.data;
};

export const getProjectWithdrawals = async (
  projectId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await AxiosInstance.get(
    API_ROUTES.WALLET.GET_PROJECT_WITHDRAWALS.replace(":projectId", projectId),
    {
      params: { page, limit },
    },
  );

  return response.data.data;
};

// STRIPE CONNECT
export const createStripeAccount = async () => {
  const res = await AxiosInstance.post(API_ROUTES.WALLET.STRIPE_ACCOUNT);
  return res.data.data;
};

export const getStripeOnboardingLink = async () => {
  const res = await AxiosInstance.get(API_ROUTES.WALLET.STRIPE_ONBOARD_LINK);
  return res.data.data.url as string;
};

// BANK WITHDRAWAL
export const withdrawToBank = async (amount: number) => {
  const res = await AxiosInstance.post(API_ROUTES.WALLET.BANK_WITHDRAWAL, {
    amount,
  });
  return res.data.data;
};
