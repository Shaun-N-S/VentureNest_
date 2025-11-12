import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllInvestors,
  updateInvestorStatus,
} from "../../../services/Admin/Investor/AdminInvestorService";

export const useGetAllInvestors = (
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["investors", page, limit, status, search],
    queryFn: () => getAllInvestors(page, limit, status, search),
  });
};

export const useUpdateInvestorStatus = () => {
  return useMutation({
    mutationFn: ({
      investorId,
      currentStatus,
    }: {
      investorId: string;
      currentStatus: string;
    }) => updateInvestorStatus({ investorId, currentStatus }),
  });
};
