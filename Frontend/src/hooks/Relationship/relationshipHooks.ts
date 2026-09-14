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
} from "../../services/Relationships/relationshipService";
import type { UpdateConnectionPayload } from "../../types/updateConnectionPayload";
import type { RelationshipStatus } from "../../types/ConnectionsPeopleResponseType";

export const useGetNetworkUsers = (limit: number, search?: string) => {
  return useInfiniteQuery({
    queryKey: ["network-users", limit, search],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getNetworkUsers(pageParam as number, limit, search),
    getNextPageParam: (lastPage) =>
      lastPage.data.currentPage < lastPage.data.totalPages
        ? lastPage.data.currentPage + 1
        : undefined,
  });
};

export const useSendConnectionReq = () => {
  return useMutation({
    mutationFn: (toUserId: string) => sendConnectionReq(toUserId),
  });
};

export const useGetConnectionReq = (
  page: number,
  limit: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["personal-connection-req", page, limit],
    queryFn: () => getConnectionReq(page, limit),
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const useConnectionStatusUpdate = () => {
  return useMutation({
    mutationFn: ({ fromUserId, status }: UpdateConnectionPayload) =>
      updateConnectionReqStatus(fromUserId, status),
  });
};

export const useConnectionsPeopleList = (
  search?: string,
  limit = 10,
  enabled = true,
) => {
  return useInfiniteQuery({
    queryKey: ["connections-people-list", search],
    enabled,
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
  enabled = true,
) => {
  return useInfiniteQuery({
    queryKey: ["user-connections-people-list", userId, search],
    enabled,

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
