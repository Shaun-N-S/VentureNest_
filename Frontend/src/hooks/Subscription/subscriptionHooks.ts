import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCheckoutSession,
  getCurrentSubscription,
} from "../../services/Subscription/subscriptionService";
import toast from "react-hot-toast";

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: (planId: string) => createCheckoutSession(planId),
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (error) => {
      console.error("Checkout failed", error);
      toast.error("Unable to start checkout. Please try again.");
    },
  });
};

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ["current-subscription"],
    queryFn: getCurrentSubscription,
    retry: false,
  });
};
