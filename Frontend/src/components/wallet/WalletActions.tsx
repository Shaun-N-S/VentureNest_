"use client";

import { Plus, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onAddFunds: () => void;
  onWithdraw?: () => void;
}

export default function WalletActions({ onAddFunds, onWithdraw }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-fit">
      {onWithdraw && (
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onWithdraw}
          className="group flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
            <ArrowUpRight className="w-4 h-4 text-slate-600" />
          </div>
          Withdraw
        </motion.button>
      )}

      <motion.button
        whileHover={{
          y: -2,
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)", // Fixed: Changed 'shadow' to 'boxShadow'
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddFunds}
        className="flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
      >
        <div className="p-1.5 rounded-lg bg-white/20">
          <Plus className="w-4 h-4 text-white" />
        </div>
        Add Funds
      </motion.button>
    </div>
  );
}
