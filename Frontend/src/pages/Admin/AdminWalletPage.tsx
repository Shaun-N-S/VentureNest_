import { useMemo, useState } from "react";
import { TrendingUp, Wallet, History, Filter } from "lucide-react";
import { format } from "date-fns";
import { useAdminPlatformWallet } from "../../hooks/Admin/FinanceHooks";
import { useAdminTransactions } from "../../hooks/Admin/TransactionHooks";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import type { AdminTransaction } from "../../types/adminFinanceType";

type AdminTransactionRow = AdminTransaction & {
  index: number;
};

export default function AdminWalletPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({
    reason: "",
    action: "",
    status: "",
    dealId: "",
  });

  const { data: wallet, isLoading: walletLoading } =
    useAdminPlatformWallet(true);

  const { data: txData, isLoading: txLoading } = useAdminTransactions(
    page,
    limit,
    filters,
  );

  const formattedTransactions: AdminTransactionRow[] = useMemo(() => {
    return (
      txData?.transactions.map((tx, index) => ({
        ...tx,
        index: (page - 1) * limit + index + 1,
      })) ?? []
    );
  }, [txData, page, limit]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "FAILED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const headers = useMemo(
    () => [
      {
        id: "index",
        label: "#",
        render: (row: AdminTransactionRow) => (
          <span className="text-slate-400 font-medium">{row.index}</span>
        ),
      },
      {
        id: "details",
        label: "Transaction Details",
        render: (row: AdminTransactionRow) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 capitalize">
              {row.reason.replace(/_/g, " ").toLowerCase()}
            </span>
            <span className="text-[10px] text-slate-400">
              {format(new Date(row.createdAt), "MMM dd, yyyy • hh:mm a")}
            </span>
          </div>
        ),
      },
      {
        id: "deal",
        label: "Related Deal",
        render: (row: AdminTransactionRow) => (
          <span className="font-mono text-xs text-slate-500">
            {row.relatedDealId || "System"}
          </span>
        ),
      },
      {
        id: "status",
        label: "Status",
        render: (row: AdminTransactionRow) => (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(
              row.status,
            )}`}
          >
            {row.status}
          </span>
        ),
      },
      {
        id: "amount",
        label: "Amount",
        render: (row: AdminTransactionRow) => (
          <div className="text-right whitespace-nowrap">
            <span
              className={`text-sm font-bold ${
                row.action === "CREDIT" ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              {row.action === "CREDIT" ? "+" : "-"} ₹
              {row.amount.toLocaleString()}
            </span>
            <p className="text-[9px] text-slate-400 uppercase tracking-tighter">
              {row.action}
            </p>
          </div>
        ),
      },
    ],
    [],
  );

  if (walletLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Platform Treasury
        </h1>
        <p className="text-slate-500 text-sm">
          Monitor platform liquidity, fees, and global transaction logs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-hover hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Balance
              </p>
              <h3 className="text-2xl font-bold text-slate-900">
                ₹{wallet?.balance.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-hover hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Withdrawable
              </p>
              <h3 className="text-2xl font-bold text-slate-900">
                ₹{wallet?.totalAvailableBalance.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1 rounded-2xl border border-slate-900 bg-slate-900 p-6 text-white shadow-lg">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Total Logs
          </p>
          <h3 className="text-2xl font-bold">
            {txData?.totalTransactions ?? 0}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
            <History className="h-3 w-3" />
            <span>Last updated just now</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-2 text-slate-500 md:border-r md:pr-4">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <select
            value={filters.reason}
            onChange={(e) => setFilters({ ...filters, reason: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Reasons</option>
            <option value="SUBSCRIPTION">Subscription</option>
            <option value="INVESTMENT">Investment</option>
            <option value="PLATFORM_FEE">Platform Fee</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="REFUND">Refund</option>
            <option value="WALLET_TOPUP">Wallet Topup</option>
          </select>

          {/* <select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Actions</option>
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
            <option value="TRANSFER">Transfer</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select> */}
        </div>

        {/* <div className="relative md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Deal ID..."
            value={filters.dealId}
            onChange={(e) => setFilters({ ...filters, dealId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div> */}
      </div>

      {/* Responsive Table Container */}
      <div
        className={`rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity ${txLoading ? "opacity-50" : "opacity-100"}`}
      >
        <Table<AdminTransactionRow>
          headers={headers}
          data={formattedTransactions}
        />

        {!txLoading && formattedTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <History className="h-12 w-12 opacity-20" />
            <p className="mt-2 font-medium">
              No transactions found matching filters
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {txData && (
          <Pagination
            totalPages={txData.totalPages}
            currentPage={txData.currentPage}
            setPage={setPage}
          />
      )}
    </div>
  );
}
