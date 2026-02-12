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

  const firstLetter = notification.sender.userName?.[0]?.toUpperCase() ?? "U";

  return (
    <div
      className={`group relative p-3 rounded-xl transition-all duration-200 border ${
        !notification.isRead
          ? "bg-blue-50/50 border-blue-100 shadow-sm"
          : "bg-white border-transparent hover:bg-gray-50"
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          {notification.sender.profileImg ? (
            <img
              src={notification.sender.profileImg}
              alt={notification.sender.userName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 border border-gray-300">
              {firstLetter}
            </div>
          )}
          {!notification.isRead && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-600 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm font-bold text-slate-900 truncate">
              {notification.sender.userName}
            </p>
            <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
              {/* Optional: use formatDistanceToNow for a premium feel */}
              {new Date(notification.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 leading-snug mt-0.5">
            {notification.message}
          </p>

          {!notification.isRead && (
            <button
              onClick={handleMarkRead}
              className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tight"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
