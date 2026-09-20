import React, { useEffect, useState } from "react";
import { Bell, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
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
import NotificationModal from "../modals/NotificationModal";
import { disconnectSocket } from "@/lib/socket";

const menuItems: Record<UserRole, { name: string; path: string }[]> = {
  ADMIN: [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Wallet", path: "/admin/wallet" },
    { name: "Users", path: "/admin/users" },
    { name: "Projects", path: "/admin/projects" },
    { name: "Investors", path: "/admin/investors" },
    { name: "Verifications", path: "/admin/verifications" },
    { name: "Withdrawal Request", path: "/admin/withdrawals" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Subscriptions", path: "/admin/subscriptions" },
  ],
  USER: [
    { name: "Home", path: "/home" },
    { name: "My Network", path: "/mynetwork" },
    { name: "Projects", path: "/projects" },
    { name: "Wallet", path: "/wallet" },
    { name: "Dashboard", path: "/dashboard" },
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
  const location = useLocation();
  const dispatch = useDispatch();

  const userData = useSelector((state: Rootstate) => state.authData);
  const role = userData.role as UserRole;

  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navItems = role ? menuItems[role] : [];

  const { mutate: logout } = useLogout();

  const isUserOrInvestor = role === "USER" || role === "INVESTOR";

  const { data, isLoading, isError } = useGetProfileImg(
    userData.id,
    isUserOrInvestor,
  );

  const { data: notificationData } = useGetNotifications(
    1,
    10,
    isUserOrInvestor,
  );
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

  const toggleAvatarMenu = () => {
    setIsMobileMenuOpen(false);
    setIsAvatarOpen((p) => !p);
  };

  const toggleMobileMenu = () => {
    setIsAvatarOpen(false);
    setIsMobileMenuOpen((p) => !p);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeAll();
  };

  const handleLogout = () => {
    const roleSnapshot = role;

    logout(undefined, {
      onSuccess: async () => {
        disconnectSocket();
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

  const handleMessages = () => {
    if (role === "INVESTOR") {
      navigate("/investor/chat");
    } else if (role === "USER") {
      navigate("/chat");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14 gap-2">
        <div
          className="text-lg sm:text-xl font-semibold cursor-pointer truncate"
          onClick={handleHome}
        >
          VentureNest
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Desktop nav links */}
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`cursor-pointer transition-colors ${
                    isActive
                      ? "text-black font-semibold"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-5">
            {role !== "ADMIN" && (
              <>
                <MessageCircle
                  className="hidden md:block w-5 h-5 cursor-pointer text-gray-600 hover:text-black transition"
                  onClick={handleMessages}
                />
                <button
                  type="button"
                  aria-label="Messages"
                  onClick={handleMessages}
                  className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:bg-gray-100 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Notifications - visible on all breakpoints */}
            <div className="relative">
              {isUserOrInvestor && (
                <>
                  <Bell
                    className="hidden md:block w-5 h-5 cursor-pointer text-gray-600 hover:text-black transition"
                    onClick={handleNotificationBell}
                  />
                  <button
                    type="button"
                    aria-label="Notifications"
                    onClick={handleNotificationBell}
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:bg-gray-100 transition"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                </>
              )}

              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 md:-top-2 md:-right-2 bg-red-500 text-white text-[10px] md:text-xs min-w-[16px] md:min-w-0 h-4 md:h-auto px-1 md:px-1.5 flex md:block items-center justify-center rounded-full pointer-events-none">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Desktop avatar + dropdown */}
            <div className="relative hidden md:block">
              <div
                className="cursor-pointer"
                onClick={toggleAvatarMenu}
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
                    className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg z-50"
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

            {/* Mobile avatar - opens the mobile menu */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={toggleMobileMenu}
              className="md:hidden rounded-full"
            >
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Avatar className="w-8 h-8">
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
            </button>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-gray-700 hover:bg-gray-100 transition"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <ul className="max-h-[calc(100vh-3.5rem)] overflow-y-auto p-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full text-left px-3 py-3 rounded-md text-base transition-colors ${
                        isActive
                          ? "bg-gray-100 text-black font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}

              {role !== "ADMIN" && (
                <li>
                  <button
                    type="button"
                    onClick={handleProfile}
                    className="w-full text-left px-3 py-3 rounded-md text-base text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </button>
                </li>
              )}

              <li className="mt-1 pt-1 border-t">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-3 rounded-md text-base text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {isUserOrInvestor && (
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
