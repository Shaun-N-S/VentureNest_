import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  getConnectionReq,
  getConnectionsPeopleList,
  getNetworkUsers,
  getRelationshipStatus,
  getUserConnectionsPeopleList,
  removeConnection,
  sendConnectionReq,
  updateConnectionReqStatus,
  type GetNetworkUsersResponse,
} from "../../services/Relationships/relationshipService";
import type { UpdateConnectionPayload } from "../../types/updateConnectionPayload";
import type { RelationshipStatus } from "../../types/ConnectionsPeopleResponseType";

export const useGetNetworkUsers = (
  page: number,
  limit: number,
  search?: string,
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
  return useInfiniteQuery({
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

export const useRemoveConnection = () => {
  return useMutation({
    mutationFn: (userId: string) => removeConnection(userId),
  });
};

export const useRelationshipStatus = (userId?: string) => {
  return useQuery<RelationshipStatus>({
    queryKey: ["relationship-status", userId],
    queryFn: () => getRelationshipStatus(userId!),
    enabled: !!userId,
  });
};

export const useUserConnectionsPeopleList = (
  userId: string,
  search?: string,
  limit = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["user-connections-people-list", userId, search],
    enabled: !!userId,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getUserConnectionsPeopleList(userId, pageParam as number, limit, search),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
