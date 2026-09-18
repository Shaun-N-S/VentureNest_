import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/Notification/notificationService";
import type { NotificationResponse } from "../../types/notification";

export const useGetNotifications = (
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
): UseQueryResult<NotificationResponse, Error> => {
  return useQuery<NotificationResponse, Error>({
    queryKey: ["notifications", page],
    queryFn: () => getMyNotifications(page, limit),
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteNotifications = (
  limit: number = 10,
  enabled: boolean = true,
) => {
  return useInfiniteQuery({
    queryKey: ["notifications-infinite"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getMyNotifications(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),

    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<NotificationResponse>(
        ["notifications", 1],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData.notifications.map((n) =>
              n._id === notificationId ? { ...n, isRead: true } : n,
            ),
            unreadCount: Math.max(oldData.unreadCount - 1, 0),
          };
        },
      );

      queryClient.setQueryData<InfiniteData<NotificationResponse>>(
        ["notifications-infinite"],
        (old) => {
          if (!old) return old;

          const newUnreadCount = Math.max(
            (old.pages[0]?.unreadCount ?? 0) - 1,
            0,
          );

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              unreadCount: newUnreadCount,
              notifications: page.notifications.map((n) =>
                n._id === notificationId ? { ...n, isRead: true } : n,
              ),
            })),
          };
        },
      );
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.setQueryData<NotificationResponse>(
        ["notifications", 1],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData.notifications.map((n) => ({
              ...n,
              isRead: true,
            })),
            unreadCount: 0,
          };
        },
      );

      queryClient.setQueryData<InfiniteData<NotificationResponse>>(
        ["notifications-infinite"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              unreadCount: 0,
              notifications: page.notifications.map((n) => ({
                ...n,
                isRead: true,
              })),
            })),
          };
        },
      );
    },
  });
};
