import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { ApiResponse } from "../../types/apiResponseType";
import type { CurrentSubscription } from "../../types/currentSubscriptionType";

export const createCheckoutSession = async (planId: string) => {
  const response = await AxiosInstance.post(API_ROUTES.SUBSCRIPTION.CHECKOUT, {
    planId,
  });

  return response.data.data.url as string;
};

export const getCurrentSubscription =
  async (): Promise<CurrentSubscription | null> => {
    const response = await AxiosInstance.get<
      ApiResponse<CurrentSubscription | null>
    >(API_ROUTES.SUBSCRIPTION.CURRENT);

    return response.data.data;
  };
