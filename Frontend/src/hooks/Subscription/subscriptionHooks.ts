import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "../../services/Subscription/subscriptionService";

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: (planId: string) => createCheckoutSession(planId),
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (error) => {
      console.error("Checkout failed", error);
      alert("Unable to start checkout. Please try again.");
    },
  });
};
