import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { ApiResponse } from "../../types/apiResponseType";
import type { PaymentSessionSummary } from "../../types/paymentSessionType";

export const getPaymentSessionSummary = async (
  sessionId: string,
): Promise<PaymentSessionSummary> => {
  const response = await AxiosInstance.get<ApiResponse<PaymentSessionSummary>>(
    API_ROUTES.PAYMENT.SESSION_SUMMARY.replace(":sessionId", sessionId),
  );

  return response.data.data;
};
