import { useQuery } from "@tanstack/react-query";
import { getPaymentSessionSummary } from "../../services/Payment/paymentService";

export const usePaymentSessionSummary = (sessionId?: string | null) => {
  return useQuery({
    queryKey: ["payment-session-summary", sessionId],
    queryFn: () => getPaymentSessionSummary(sessionId!),
    enabled: Boolean(sessionId),
    retry: false,
  });
};
