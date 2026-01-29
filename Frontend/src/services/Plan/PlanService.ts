import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getAvailablePlans = async () => {
  const response = await AxiosInstance.get(API_ROUTES.PLANS.AVAILABLE_PLANS);
  return response.data.data;
};
