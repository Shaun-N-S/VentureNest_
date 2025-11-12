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
  const { data: profileData, isLoading, isError, error } = useGetProfileImg(userData.id)
  const dispatch = useDispatch()
  console.log("navbar data from redux", userData)

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
    console.log(currentRole);

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
    } else if (currentRole === "USER") {
      navigate('/profile');
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
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md border-b z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={handleHome}
        >
          VentureNest
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm">
          {menuItems[role].map((item, idx) => (
            <li
              key={idx}
              className="cursor-pointer hover:text-black text-gray-600 transition"
              onClick={() => handleNavigation(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-4">
          {role !== "ADMIN" && (
            <MessageCircle className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" />
          )}
          <Bell className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" />
          <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isError ? (
              <img
                src="/default-avatar.png"
                alt="default"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                title={error?.message || "Could not load image"}
              />
            ) : (
              <img
                src={userData.profileImg}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
            )}

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
              <ul className="py-2 text-sm text-gray-700">
                {/* Only show for non-admin users */}
                {userData?.role !== "ADMIN" && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleProfile}
                  >
                    Your Profile
                  </li>
                )}

                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t shadow-md"
          >
            <ul className="flex flex-col space-y-3 px-6 py-4">
              {menuItems[role].map((item, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer text-gray-700 hover:text-black transition"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                </li>
              ))}

              <div className="mt-4 flex items-center gap-4 border-t pt-3">
                {role !== "ADMIN" && (
                  <MessageCircle className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" />
                )}
                <Bell className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" />
                <img
                  src={saasFounder}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
