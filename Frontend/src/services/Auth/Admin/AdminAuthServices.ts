import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";
import type { LoginPayload } from "../../../types/AuthPayloads";

export const adminLogin = async (data: LoginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.ADMIN_LOGIN, data);
  return response.data;
};
