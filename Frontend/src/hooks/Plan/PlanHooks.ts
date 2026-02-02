import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKey";
import { getAvailablePlans } from "../../services/Plan/PlanService";
import type { PaginatedPlansExplaination } from "../../types/planType";

export const useGetAvailablePlans = () => {
  return useQuery<PaginatedPlansExplaination>({
    queryKey: [QUERY_KEYS.AVAILABLE_PLANS],
    queryFn: getAvailablePlans,
  });
};
