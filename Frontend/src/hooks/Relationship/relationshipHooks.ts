import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  getConnectionReq,
  getConnectionsPeopleList,
  getNetworkUsers,
  sendConnectionReq,
  updateConnectionReqStatus,
  type GetNetworkUsersResponse,
} from "../../services/Relationships/relationshipService";
import type { UpdateConnectionPayload } from "../../types/updateConnectionPayload";
import type { ConnectionsPeopleResponse } from "../../types/ConnectionsPeopleResponseType";

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

export const useConnectionsPeopleList = (search?: string, limit = 10) => {
  return useInfiniteQuery<ConnectionsPeopleResponse>({
    queryKey: ["connections-people-list", search],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getConnectionsPeopleList(pageParam as number, limit, search),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
