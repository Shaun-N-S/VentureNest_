import React, { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSidebarProps {
  menuItems: string[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r shadow-md">
        <div className="px-6 py-4 text-xl font-bold">VentureNest</div>

        <ul className="flex-1 flex flex-col gap-2 px-4 mt-4">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100 transition"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="px-6 py-4 flex items-center gap-3 border-t mt-auto">
          <Bell className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" />
          <img
            src="https://via.placeholder.com/32"
            alt="profile"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-50 p-6">
        {/* Mobile top bar */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <div className="text-xl font-bold">VentureNest</div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4"
            >
              <ul className="flex flex-col gap-2">
                {menuItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Placeholder */}
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to the admin panel.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
