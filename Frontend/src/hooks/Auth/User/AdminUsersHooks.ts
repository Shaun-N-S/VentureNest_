import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  updateUserStatus,
} from "../../../services/Admin/User/AdminUserService";

export const useGetAllUsers = (
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["users", page, limit, status, search],
    queryFn: () => getAllUsers(page, limit, status, search),
  });
};

export const useUpdateUserStatus = () => {
  return useMutation({
    mutationFn: ({
      userId,
      currentStatus,
    }: {
      userId: string;
      currentStatus: string;
    }) => updateUserStatus({ userId, currentStatus }),
  });
};
