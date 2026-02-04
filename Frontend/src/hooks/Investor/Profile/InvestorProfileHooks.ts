import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getInvestorProfile,
  investorKYCUpdate,
  investorProfileUpdate,
} from "../../../services/Investor/InvestorProfileService";

type QueryOptions = {
  enabled?: boolean;
};

export const useFetchInvestorProfile = (
  id: string,
  queryOptions?: QueryOptions,
) => {
  return useQuery({
    queryKey: ["investorProfile", id],
    queryFn: () => getInvestorProfile(id),
    enabled: queryOptions?.enabled ?? Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useInvestorProfileUpdate = () => {
  return useMutation({
    mutationFn: (formData: FormData) => investorProfileUpdate(formData),
  });
};

export const useKycUpdate = () => {
  return useMutation({
    mutationFn: (formData: FormData) => investorKYCUpdate(formData),
  });
};
