import {
  useMutation,
  useQuery,
  useQueryClient,
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
): UseQueryResult<NotificationResponse, Error> => {
  return useQuery<NotificationResponse, Error>({
    queryKey: ["notifications", page],
    queryFn: () => getMyNotifications(page, limit),
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
    },
  });
};
