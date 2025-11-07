import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getInvestorProfile,
  investorProfileUpdate,
} from "../../../services/Investor/InvestorProfileService";

export const useFetchInvestorProfile = (id: string) => {
  return useQuery({
    queryKey: ["investorProfile", id],
    queryFn: () => getInvestorProfile(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInvestorProfileUpdate = () => {
  return useMutation({
    mutationFn: (formData: FormData) => investorProfileUpdate(formData),
  });
};
