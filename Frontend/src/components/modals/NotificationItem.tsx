import { useMarkNotificationRead } from "../../hooks/Notification/notificationHooks";
import type { Notification } from "../../types/notification";

interface Props {
  notification: Notification;
}

const NotificationItem = ({ notification }: Props) => {
  const markMutation = useMarkNotificationRead();

  const handleMarkRead = () => {
    markMutation.mutate(notification._id);
  };

  return (
    <div
      className={`p-4 rounded-xl border ${
        !notification.isRead ? "bg-blue-50" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm">
            {notification.type.replace("_", " ")}
          </h3>

          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

          <p className="text-xs text-gray-400 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>

        {!notification.isRead && (
          <button
            onClick={handleMarkRead}
            className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
