import { useState } from "react";
import { X, Bell } from "lucide-react";
import type { Notification } from "../../types/notification";
import { useGetNotifications, useMarkAllNotificationsRead } from "../../hooks/Notification/notificationHooks";
import NotificationItem from "./NotificationItem";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal = ({ isOpen, onClose }: Props) => {
  const [tab, setTab] = useState<"UNREAD" | "ALL">("UNREAD");

  const { data, isLoading } = useGetNotifications();
  const markAllMutation = useMarkAllNotificationsRead();

  if (!isOpen) return null;

  const notifications: Notification[] = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const filtered =
    tab === "UNREAD" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-[380px] h-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <div>
              <h2 className="font-semibold text-lg">Notification</h2>
              <p className="text-sm text-gray-500">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("UNREAD")}
              className={`px-3 py-1 rounded-full text-sm ${
                tab === "UNREAD" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Unread {unreadCount}
            </button>

            <button
              onClick={() => setTab("ALL")}
              className={`px-3 py-1 rounded-full text-sm ${
                tab === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              All
            </button>
          </div>

          <button
            onClick={() => markAllMutation.mutate()}
            className="text-blue-500 text-sm font-medium"
          >
            Mark all as read
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && <p className="text-center">Loading...</p>}

          {!isLoading && filtered.length === 0 && (
            <p className="text-center text-gray-500">No notifications</p>
          )}

          {filtered.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
