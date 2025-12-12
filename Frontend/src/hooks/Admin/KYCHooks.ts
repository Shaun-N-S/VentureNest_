import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllInvestorsKyc,
  getAllUsersKyc,
  updateInvestorKycStatus,
  updateUserKycStatus,
} from "../../services/Admin/KYC/AdminKycService";

export const useFetchAllUsersKyc = (
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["users-kyc", page, limit, status, search],
    queryFn: () => getAllUsersKyc(page, limit, status, search),
  });
};

export const useFetchAllInvestorsKyc = (
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["investors-kyc", page, limit, status, search],
    queryFn: () => getAllInvestorsKyc(page, limit, status, search),
  });
};

export const useUpdateUsersKyc = () => {
  return useMutation({
    mutationFn: ({
      userId,
      newStatus,
      reason,
    }: {
      userId: string;
      newStatus: string;
      reason?: string;
    }) => updateUserKycStatus({ userId, newStatus, reason }),
  });
};

export const useUpdateInvestorKyc = () => {
  return useMutation({
    mutationFn: ({
      investorId,
      newStatus,
      reason,
    }: {
      investorId: string;
      newStatus: string;
      reason?: string;
    }) => updateInvestorKycStatus({ investorId, newStatus, reason }),
  });
};
