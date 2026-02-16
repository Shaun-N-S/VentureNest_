import type { Socket } from "socket.io-client";
import { queryClient } from "../main";
import type { Notification, NotificationResponse } from "../types/notification";


export const registerNotificationSocket = (socket: Socket): void => {
  socket.on("notification:new", (notification: Notification) => {
    console.log("Realtime notification received", notification);

    queryClient.setQueryData<NotificationResponse>(
      ["notifications", 1],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          notifications: [notification, ...oldData.notifications],
          unreadCount: oldData.unreadCount + 1,
        };
      },
    );
  });
};
