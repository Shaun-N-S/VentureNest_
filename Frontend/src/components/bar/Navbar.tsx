import React, { useEffect, useState } from "react";
import { Bell, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { persistor, type Rootstate } from "../../store/store";
import type { UserRole } from "../../types/UserRole";
import { useGetProfileImg, useLogout } from "../../hooks/Auth/AuthHooks";
import { clearData, updateUserData } from "../../store/Slice/authDataSlice";
import { deleteToken } from "../../store/Slice/tokenSlice";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { queryClient } from "../../main";
import { useGetNotifications } from "../../hooks/Notification/notificationHooks";
import { initSocket } from "../../lib/socket";
import NotificationModal from "../modals/NotificationModal";

const menuItems: Record<UserRole, { name: string; path: string }[]> = {
  ADMIN: [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Projects", path: "/admin/projects" },
    { name: "Investors", path: "/admin/investors" },
    { name: "Verifications", path: "/admin/verifications" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Subscriptions", path: "/admin/subscriptions" },
  ],
  USER: [
    { name: "Home", path: "/home" },
    { name: "My Network", path: "/mynetwork" },
    { name: "Projects", path: "/projects" },
    { name: "Wallet", path: "/wallet" },
    { name: "My offers", path: "/offers" },
    { name: "My Sessions", path: "/sessions" },
    { name: "Plans", path: "/plans" },
  ],
  INVESTOR: [
    { name: "Home", path: "/investor/home" },
    { name: "My Network", path: "/investor/mynetwork" },
    { name: "Projects", path: "/investor/projects" },
    { name: "Wallet", path: "/investor/wallet" },
    { name: "Dashboard", path: "/investor/dashboard" },
    { name: "My offers", path: "/investor/offers" },
    { name: "My Sessions", path: "/investor/sessions" },
    { name: "Plans", path: "/investor/plans" },
  ],
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state: Rootstate) => state.authData);
  const role = userData.role as UserRole;

  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = role ? menuItems[role] : [];

  const { mutate: logout } = useLogout();

  const { data, isLoading, isError } = useGetProfileImg(userData.id);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { data: notificationData } = useGetNotifications();
  const unreadCount = notificationData?.unreadCount ?? 0;

  useEffect(() => {
    if (data?.data?.profileImg) {
      dispatch(updateUserData({ profileImg: data.data.profileImg }));
    }
  }, [data, dispatch]);

  const closeAll = () => {
    setIsAvatarOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeAll();
  };

  const handleLogout = () => {
    const roleSnapshot = role;

    logout(undefined, {
      onSuccess: async () => {
        dispatch(clearData());
        dispatch(deleteToken());

        await persistor.purge();

        queryClient.clear();

        if (roleSnapshot === "INVESTOR") navigate("/investor/login");
        else if (roleSnapshot === "ADMIN") navigate("/admin/login");
        else navigate("/login");

        toast.success("Logged out successfully!");
      },
      onError: () => toast.error("Logout failed"),
    });
  };

  const handleProfile = () => {
    if (role === "INVESTOR") navigate("/investor/profile");
    else if (role === "USER") navigate("/profile");
    closeAll();
  };

  const handleHome = () => {
    if (role === "INVESTOR") navigate("/investor/home");
    else if (role === "ADMIN") navigate("/admin/dashboard");
    else navigate("/home");
  };

  // const handleNotificationBell = () => {
  //   if (role === "INVESTOR") navigate("/investor/notifications");
  //   else if (role === "USER") navigate("/notifications");
  // };

  const handleNotificationBell = () => {
    setIsNotificationOpen(true);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
        <div
          className="text-xl font-semibold cursor-pointer"
          onClick={handleHome}
        >
          VentureNest
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <li
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="cursor-pointer text-gray-600 hover:text-black"
              >
                {item.name}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            {role !== "ADMIN" && <MessageCircle className="w-5 h-5" />}
            <div className="relative">
              <Bell
                className="w-5 h-5 cursor-pointer"
                onClick={handleNotificationBell}
              />

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => setIsAvatarOpen((p) => !p)}
              >
                {isLoading ? (
                  <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                  <Avatar className="w-9 h-9">
                    <AvatarImage
                      src={
                        isError
                          ? "/default-avatar.png"
                          : userData.profileImg || "/placeholder.svg"
                      }
                    />
                    <AvatarFallback>
                      {userData.userName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              <AnimatePresence>
                {isAvatarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg"
                  >
                    {role !== "ADMIN" && (
                      <button
                        onClick={handleProfile}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Profile
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen((p) => !p)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <ul className="p-4 space-y-4">
              {navItems.map((item) => (
                <li
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="cursor-pointer"
                >
                  {item.name}
                </li>
              ))}
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
