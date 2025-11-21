import React, { useEffect, useState } from "react";
import { Bell, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../types/UserRole";
import saasFounder from "../../assets/saas-founder-portrait.jpg";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import { useGetProfileImg, useLogout } from "../../hooks/Auth/AuthHooks";
import { useDispatch } from "react-redux";
import { clearData, updateUserData } from "../../store/Slice/authDataSlice";
import { deleteToken } from "../../store/Slice/tokenSlice";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface NavbarProps {
  role: UserRole;
}

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
    { name: "My Network", path: "/network" },
    { name: "Projects", path: "/projects" },
    { name: "Wallet", path: "/wallet" },
    { name: "Book a Session", path: "/book-session" },
    { name: "My offers", path: "/offers" },
    { name: "My Sessions", path: "/sessions" },
  ],
  INVESTOR: [
    { name: "Home", path: "/investor/home" },
    { name: "My Network", path: "/investor/network" },
    { name: "Projects", path: "/investor/projects" },
    { name: "Wallet", path: "/investor/wallet" },
    { name: "Schedule session", path: "/investor/schedule" },
    { name: "Dashboard", path: "/investor/dashboard" },
    { name: "My Sessions", path: "/investor/sessions" },
  ],
};

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state: Rootstate) => state.authData);
  const { mutate: logout } = useLogout()
  const { data: profileData, isLoading, isError } = useGetProfileImg(userData.id)
  const dispatch = useDispatch()

  useEffect(() => {
    if (profileData?.data?.profileImg) {
      console.log(profileData?.data?.profileImg)
      dispatch(updateUserData({ profileImg: profileData.data.profileImg }));
    }
  }, [profileData, dispatch]);


  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };


  const handleLogout = () => {
    const currentRole = userData.role;

    logout(undefined, {
      onSuccess: () => {
        dispatch(clearData());
        dispatch(deleteToken());
        toast.success("Logged out successfully!");

        if (currentRole === "INVESTOR") {
          navigate("/investor/login");
        } else if (currentRole === "ADMIN") {
          navigate("/admin/login");
        } else {
          navigate("/login");
        }
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      },
    });
  };

  const handleProfile = () => {
    const currentRole = userData.role;
    if (currentRole === "INVESTOR") {
      navigate('/investor/profile');
      setIsOpen(false);
    } else if (currentRole === "USER") {
      navigate('/profile');
      setIsOpen(false);

    }
  }

  const handleHome = () => {
    const currentRole = userData.role;
    if (currentRole === "INVESTOR") {
      navigate("/investor/home");
    } else if (currentRole === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/home");
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-14">

        {/* Logo */}
        <div
          className="text-xl font-semibold tracking-tight cursor-pointer"
          onClick={handleHome}
        >
          VentureNest
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">

          {/* Menu Items */}
          <ul className="flex gap-6 text-[15px] font-medium">
            {menuItems[role].map((item) => (
              <li
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="cursor-pointer text-gray-600 hover:text-black transition"
              >
                {item.name}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-5 ml-6">
            {role !== "ADMIN" && (
              <MessageCircle className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer" />
            )}
            <Bell className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer" />

            {/* Avatar with menu */}
            <div className="relative">
              <div onClick={() => setIsOpen((p) => !p)} className="cursor-pointer">
                {isLoading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={
                        isError
                          ? "/default-avatar.png"
                          : userData?.profileImg || "/placeholder.svg"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {userData?.userName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* ▼ Dropdown Menu (Instagram Style) */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
                  >
                    {/* Triangle */}
                    <div className="absolute -top-2 right-4 w-3 h-3 rotate-45 bg-white border-l border-t border-gray-200" />

                    <ul className="text-sm py-2">
                      {userData?.role !== "ADMIN" && (
                        <li
                          onClick={handleProfile}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={userData?.profileImg || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {userData?.userName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          Profile
                        </li>
                      )}

                      <li
                        onClick={handleLogout}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                      >
                        Logout
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t shadow-inner"
          >
            <ul className="flex flex-col gap-4 px-6 py-4 text-[16px] font-medium">
              {menuItems[role].map((item) => (
                <li
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="cursor-pointer text-gray-700 hover:text-black transition"
                >
                  {item.name}
                </li>
              ))}

              <div className="flex items-center gap-4 border-t pt-4">
                {role !== "ADMIN" && (
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                )}
                <Bell className="w-6 h-6 text-gray-600" />

                <Avatar className="w-10 h-10" onClick={handleProfile}>
                  <AvatarImage
                    src={userData?.profileImg || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {userData?.userName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <button
                onClick={handleLogout}
                className="mt-2 text-left text-red-500 hover:underline"
              >
                Logout
              </button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

};

export default Navbar;
