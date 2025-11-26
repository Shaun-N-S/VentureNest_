import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getConnectionReq,
  getNetworkUsers,
  sendConnectionReq,
  updateConnectionReqStatus,
  type GetNetworkUsersResponse,
} from "../../services/Relationships/relationshipService";
import type { UpdateConnectionPayload } from "../../types/updateConnectionPayload";

export const useGetNetworkUsers = (
  page: number,
  limit: number,
  search?: string
) => {
  return useQuery<GetNetworkUsersResponse>({
    queryKey: ["network-users", page, limit, search],
    queryFn: () => getNetworkUsers(page, limit, search),
  });
};

export const useSendConnectionReq = () => {
  return useMutation({
    mutationFn: (toUserId: string) => sendConnectionReq(toUserId),
  });
};

export const useGetConnectionReq = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["personal-connection-req", page, limit],
    queryFn: () => getConnectionReq(page, limit),
  });
};

export const useConnectionStatusUpdate = () => {
  return useMutation({
    mutationFn: ({ fromUserId, status }: UpdateConnectionPayload) =>
      updateConnectionReqStatus(fromUserId, status),
  });
};
