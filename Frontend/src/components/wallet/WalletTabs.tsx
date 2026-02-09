"use client";

import { motion } from "framer-motion";
import type { WalletType } from "../../types/wallet";
import { User, Briefcase } from "lucide-react";

interface Props {
  active: WalletType;
  onChange: (type: WalletType) => void;
}

export default function WalletTabs({ active, onChange }: Props) {
  const tabs: { id: WalletType; label: string; icon: React.ReactNode }[] = [
    { id: "PERSONAL", label: "Personal", icon: <User className="w-4 h-4" /> },
    {
      id: "PROJECT",
      label: "Projects",
      icon: <Briefcase className="w-4 h-4" />,
    },
  ];

  return (
    <div className="relative flex p-1.5 bg-slate-200/50 backdrop-blur-md rounded-[20px] border border-slate-300/50 shadow-inner w-fit">
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center gap-2.5 px-6 py-2.5 rounded-[14px] text-sm font-bold transition-colors duration-300
              ${isActive ? "text-white" : "text-slate-500 hover:text-slate-700"}
            `}
          >
            {/* Animated Background Slider */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[14px] shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            {/* Content (Z-index ensures it stays above the sliding background) */}
            <span className="relative z-10 flex items-center gap-2">
              <span
                className={`transition-transform duration-300 ${isActive ? "scale-110" : "opacity-70"}`}
              >
                {tab.icon}
              </span>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
