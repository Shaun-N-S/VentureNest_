import { useState } from "react";
import { X, Bell, CheckCheck, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Added for smooth slide-in
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
} from "../../hooks/Notification/notificationHooks";
import NotificationItem from "./NotificationItem";
import {
  useGetConnectionReq,
  useConnectionStatusUpdate,
} from "../../hooks/Relationship/relationshipHooks";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import type { NetworkUser } from "../../types/networkType";
import { ConnectionRequestCard } from "../card/ConnectionRequestCard ";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal = ({ isOpen, onClose }: Props) => {
  const [tab, setTab] = useState<"UNREAD" | "ALL">("UNREAD");
  const { data, isLoading } = useGetNotifications();
  const markAllMutation = useMarkAllNotificationsRead();
  const { data: connectionData } = useGetConnectionReq(1, 10);
  const { mutate: updateConnectionStatus } = useConnectionStatusUpdate();

  const connectionRequests: NetworkUser[] = connectionData?.data?.users ?? [];
  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const handleAccept = (userId: string) => {
    updateConnectionStatus(
      { fromUserId: userId, status: "accepted" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["personal-connection-req", 1, 10],
          });
          toast.success("Connection accepted");
        },
      },
    );
  };

  const handleReject = (userId: string) => {
    updateConnectionStatus(
      { fromUserId: userId, status: "rejected" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["personal-connection-req", 1, 10],
          });
          toast.success("Connection rejected");
        },
      },
    );
  };

  const filtered =
    tab === "UNREAD" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[400px] h-full bg-slate-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-white border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Bell size={22} />
                  </div>
                  <h2 className="font-bold text-xl text-slate-800 tracking-tight">
                    Notifications
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Action Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  {(["UNREAD", "ALL"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        tab === t
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {t === "UNREAD"
                        ? `Unread (${unreadCount})`
                        : "All Activity"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => markAllMutation.mutate()}
                  className="flex items-center gap-1.5 text-blue-600 text-xs font-bold hover:underline"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-slate-400">
                    Loading your updates...
                  </p>
                </div>
              ) : filtered.length === 0 && connectionRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="mb-4 p-4 bg-slate-100 rounded-full text-slate-400">
                    <Inbox size={40} />
                  </div>
                  <p className="text-slate-900 font-semibold">All caught up!</p>
                  <p className="text-sm text-slate-500">
                    No new notifications to show here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Connection Section */}
                  {tab === "UNREAD" && connectionRequests.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                          Pending Requests
                        </h3>
                      </div>
                      {connectionRequests.map((user) => (
                        <ConnectionRequestCard
                          key={user.id}
                          user={user}
                          onAccept={handleAccept}
                          onReject={handleReject}
                        />
                      ))}
                      <div className="pt-2 border-b border-slate-200" />
                    </div>
                  )}

                  {/* Notifications List */}
                  <div className="space-y-3">
                    {filtered.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
