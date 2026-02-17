import { useQuery } from "@tanstack/react-query";
import { getMyDeals } from "../../services/Deal/dealService";
import type { DealSummary } from "../../types/dealTypes";

export const useGetMyDeals = () => {
  return useQuery<DealSummary[]>({
    queryKey: ["my-deals"],
    queryFn: getMyDeals,
  });
};
