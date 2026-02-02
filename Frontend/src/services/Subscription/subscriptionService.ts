import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export const createCheckoutSession = async (planId: string) => {
  const response = await AxiosInstance.post(API_ROUTES.SUBSCRIPTION.CHECKOUT, {
    planId,
  });

  return response.data.data.url as string;
};
