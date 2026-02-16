import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { NotificationResponse } from "../../types/notification";

export const getMyNotifications = async (
  page: number = 1,
  limit: number = 10,
): Promise<NotificationResponse> => {
  const response = await AxiosInstance.get<{
    data: NotificationResponse;
  }>(
    `${API_ROUTES.NOTIFICATION.GET_MY_NOTIFICATIONS}?page=${page}&limit=${limit}`,
  );

  return response.data.data;
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  await AxiosInstance.patch(
    API_ROUTES.NOTIFICATION.MARK_AS_READ.replace(":id", notificationId),
  );
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await AxiosInstance.patch(API_ROUTES.NOTIFICATION.MARK_ALL_AS_READ);
};
