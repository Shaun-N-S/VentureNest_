import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  ChevronRight,
  ArrowLeft,
  Loader2,
  MapPin,
  Target,
  Users,
} from "lucide-react";

import BalanceCard from "../../components/card/BalanceCard";
import { useFetchPersonalProjects } from "../../hooks/Project/projectHooks";
import { useMyWalletTransactions } from "../../hooks/Transaction/transactionHooks";
import {
  useGetMyWallet,
  useGetProjectWallet,
} from "../../hooks/Wallet/walletHooks";
import type { TransactionAction } from "../../types/transactionTypes";
import AddFundsModal from "../../components/modals/AddFundsModal";
import WalletTabs from "../../components/wallet/WalletTabs";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import type { ProjectType } from "../../types/projectType";

export default function WalletPage() {
  const role = useSelector((state: Rootstate) => state.authData.role);
  const [activeWallet, setActiveWallet] = useState<"PERSONAL" | "PROJECT">(
    "PERSONAL",
  );
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [actionFilter, setActionFilter] = useState<
    TransactionAction | undefined
  >(undefined);

  const myWallet = useGetMyWallet();
  const projectWallet = useGetProjectWallet(selectedProjectId ?? undefined);
  const { data: projectData } = useFetchPersonalProjects(1, 20);
  const personalTransactions = useMyWalletTransactions(actionFilter);

  const projects: ProjectType[] = projectData?.data?.data?.projects ?? [];

  console.log(projects);

  if (myWallet.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Financial Center
          </h1>
          <p className="text-slate-500">
            Manage your capital and project funding.
          </p>
        </div>
        {role === "USER" && (
          <WalletTabs active={activeWallet} onChange={setActiveWallet} />
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeWallet === "PERSONAL" ? (
          <motion.div
            key="personal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Balance and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BalanceCard
                  balance={myWallet.data?.balance ?? 0}
                  available={myWallet.data?.availableBalance ?? 0}
                />
              </div>
              <div className="bg-white border rounded-3xl p-6 flex flex-col justify-center gap-4 shadow-sm">
                <Button
                  onClick={() => setShowAddFunds(true)}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2"
                >
                  <Plus className="w-5 h-5" /> Add Funds
                </Button>
                {/* <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl text-slate-600"
                >
                  Withdraw to Bank
                </Button> */}
              </div>
            </div>

            {/* Transaction Section */}
            <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-slate-800 text-lg">
                    Recent Activity
                  </h3>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 bg-slate-50 p-1 rounded-xl">
                  {["ALL", "CREDIT", "DEBIT", "TRANSFER"].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setActionFilter(
                          type === "ALL"
                            ? undefined
                            : (type as TransactionAction),
                        )
                      }
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        actionFilter === type ||
                        (type === "ALL" && !actionFilter)
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {personalTransactions.isLoading ? (
                  <div className="p-10 text-center text-slate-400">
                    Loading records...
                  </div>
                ) : personalTransactions.data?.length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    No transactions found.
                  </div>
                ) : (
                  personalTransactions.data?.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex justify-between items-center p-5 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-2xl ${
                            tx.action === "CREDIT"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {tx.action === "CREDIT" ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">
                            {tx.reason.replace("_", " ")}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            {new Date(tx.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            tx.action === "CREDIT"
                              ? "text-green-600"
                              : "text-slate-900"
                          }`}
                        >
                          {tx.action === "CREDIT" ? "+" : "-"}₹
                          {tx.amount.toLocaleString()}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase tracking-wider font-bold opacity-60"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* PROJECT WALLET VIEW */
          <motion.div
            key="project"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {!selectedProjectId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.button
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProjectId(project._id)}
                    className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 text-left transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500 overflow-hidden"
                  >
                    {/* Subtle Background Accent using Cover Image (Low Opacity) */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] grayscale group-hover:opacity-[0.08] transition-opacity">
                      <img
                        src={project.coverImageUrl}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="relative z-10">
                      {/* Logo & Category Section */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                            {project.logoUrl ? (
                              <img
                                src={project.logoUrl}
                                alt={project.startupName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl font-bold text-blue-600">
                                {project.startupName[0]}
                              </span>
                            )}
                          </div>
                          <div
                            className="absolute -bottom-2 -right-2 bg-emerald-500 w-4 h-4 rounded-full border-4 border-white"
                            title="Active Project"
                          />
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] uppercase tracking-wider"
                        >
                          {project.category}
                        </Badge>
                      </div>

                      {/* Content Section */}
                      <div className="space-y-1 mb-6">
                        <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {project.startupName}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium line-clamp-1 italic">
                          "{project.shortDescription}"
                        </p>
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                            {project.stage}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter truncate">
                            {project.location}
                          </span>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">
                            {project.teamSize}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 font-black text-sm group-hover:translate-x-1 transition-transform">
                          OPEN WALLET
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedProjectId(null)}
                  className="text-slate-500 hover:text-slate-900 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to projects
                </Button>

                {projectWallet.isLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="max-w-2xl">
                    <BalanceCard
                      balance={projectWallet.data?.balance ?? 0}
                      available={projectWallet.data?.availableBalance ?? 0}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AddFundsModal
        open={showAddFunds}
        onClose={() => setShowAddFunds(false)}
      />
    </div>
  );
}
