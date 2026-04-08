import {
  useInvestorDashboardSummary,
  useInvestorPortfolio,
  useProjectAnalytics,
} from "../../hooks/Dashboard/dashboardHooks";

import AnalyticsChart from "../../components/dashboard/AnalyticsChart";

import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/Debounce/useDebounce";
import type { MonthlyReport } from "../../types/monthlyReport";
import Pagination from "../../components/pagination/Pagination";

// ─── Icons ────────────────────────────────────────────────────────────────────
const WalletIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h18M3 6h18M5 6V4a1 1 0 011-1h12a1 1 0 011 1v2M3 10v10a1 1 0 001 1h16a1 1 0 001-1V10"
    />
  </svg>
);
const CoinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-5 h-5"
  >
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 7v1m0 8v1m-3-5h6" />
  </svg>
);
const TrendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-5 h-5"
  >
    <polyline
      strokeLinecap="round"
      strokeLinejoin="round"
      points="22 7 13.5 15.5 8.5 10.5 2 17"
    />
    <polyline
      strokeLinecap="round"
      strokeLinejoin="round"
      points="16 7 22 7 22 13"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-4 h-4"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MONTHS = [
  { label: "All Months", value: "" },
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-100 rounded-2xl ${className}`} />
);

// ─── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-14 flex flex-col items-center gap-3">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </div>
    <p className="text-sm text-slate-400 font-medium">{message}</p>
  </div>
);

// ─── Portfolio Item ────────────────────────────────────────────────────────────
interface PortfolioItem {
  projectId: string;
  startupName: string;
  investedAmount: number;
  equity: number;
  stage: string;
  status: string;
  logo?: string;
}

const statusConfig: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  PARTIALLY_PAID: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
    label: "Partial",
  },
  PAID: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-400",
    label: "Paid",
  },
  PENDING: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
    label: "Pending",
  },
};

const InvestmentRow = ({
  item,
  index,
}: {
  item: PortfolioItem;
  index: number;
}) => {
  const status = statusConfig[item.status] ?? statusConfig["PENDING"];
  const initials = item.startupName.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3 sm:gap-4 py-3.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50/80 transition-all duration-200 group cursor-pointer">
      {/* Rank */}
      <span className="text-xs text-slate-300 font-semibold w-5 text-center tabular-nums shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Logo */}
      <div className="w-10 h-10 rounded-xl shrink-0 overflow-hidden ring-1 ring-slate-100">
        {item.logo ? (
          <img
            src={item.logo}
            alt={item.startupName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold tracking-wide">
            {initials}
          </div>
        )}
      </div>

      {/* Name + Stage */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">
          {item.startupName}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          {item.stage}
        </p>
      </div>

      {/* Equity */}
      <div className="hidden sm:block text-right shrink-0">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
          Equity
        </p>
        <p className="text-sm font-bold text-indigo-600 mt-0.5">
          {item.equity}%
        </p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
          Invested
        </p>
        <p className="text-sm font-bold text-slate-800 mt-0.5">
          ₹{item.investedAmount.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Status */}
      <div
        className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full shrink-0 ${status.bg} ${status.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </div>
    </div>
  );
};

// ─── Report Card ───────────────────────────────────────────────────────────────
const ReportCard = ({
  report,
  onView,
}: {
  report: MonthlyReport;
  onView: () => void;
}) => {
  const isProfit = report.netProfitLossType === "profit";
  const profitPercent =
    report.revenue > 0
      ? Math.round((report.netProfitLossAmount / report.revenue) * 100)
      : 0;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-center gap-3">
        {/* Month badge */}
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
            {report.month.slice(0, 3)}
          </span>
          <span className="text-xs font-bold text-slate-600 leading-none mt-0.5">
            {String(report.year).slice(2)}
          </span>
        </div>

        <div>
          <p className="font-semibold text-slate-800 text-sm">
            {report.month} {report.year}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Revenue:{" "}
            <span className="font-semibold text-slate-600">
              ₹{report.revenue.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Profit/Loss pill */}
        <div
          className={`hidden sm:flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full ${
            isProfit
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          <span>{isProfit ? "↑" : "↓"}</span>
          <span>{profitPercent}%</span>
        </div>

        <button
          onClick={onView}
          className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all duration-150"
        >
          View
        </button>
      </div>
    </div>
  );
};

// ─── Report Modal ──────────────────────────────────────────────────────────────
const ReportModal = ({
  report,
  onClose,
}: {
  report: MonthlyReport;
  onClose: () => void;
}) => {
  const isProfit = report.netProfitLossType === "profit";
  const margin =
    report.revenue > 0
      ? ((report.netProfitLossAmount / report.revenue) * 100).toFixed(1)
      : "0.0";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 px-6 pt-6 pb-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <CloseIcon />
          </button>

          {/* Month + Year */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <CalendarIcon />
            </div>
            <span className="text-white/60 text-sm font-medium">
              Monthly Report
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {report.month}{" "}
            <span className="text-indigo-300">{report.year}</span>
          </h2>

          {/* Profit/Loss indicator */}
          <div
            className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold ${
              isProfit
                ? "bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/30"
                : "bg-red-400/20 text-red-300 ring-1 ring-red-400/30"
            }`}
          >
            <span>{isProfit ? "▲" : "▼"}</span>
            <span>
              {margin}% {isProfit ? "Profit Margin" : "Loss Margin"}
            </span>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/50 border-b border-slate-100">
          {[
            {
              label: "Revenue",
              value: `₹${report.revenue.toLocaleString("en-IN")}`,
              color: "text-emerald-600",
            },
            {
              label: "Expenditure",
              value: `₹${report.expenditure.toLocaleString("en-IN")}`,
              color: "text-red-500",
            },
            {
              label: "Net P&L",
              value: `₹${report.netProfitLossAmount.toLocaleString("en-IN")}`,
              color: isProfit ? "text-indigo-600" : "text-red-500",
            },
          ].map((m) => (
            <div key={m.label} className="flex flex-col items-center py-4 px-2">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {m.label}
              </p>
              <p className={`text-sm font-bold mt-1 ${m.color} text-center`}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Key Achievements */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-500 text-xs">★</span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Key Achievements
              </p>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
              <p className="text-sm text-slate-700 leading-relaxed">
                {report.keyAchievements}
              </p>
            </div>
          </div>

          {/* Challenges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center">
                <span className="text-amber-500 text-xs">⚡</span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Challenges
              </p>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5">
              <p className="text-sm text-slate-700 leading-relaxed">
                {report.challenges}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors duration-150"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Section Card Wrapper ──────────────────────────────────────────────────────
const SectionCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const SectionHeader = ({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
}) => (
  <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
    <div>
      <h2 className="font-bold text-slate-800 text-base leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>
      )}
    </div>
    {badge}
  </div>
);

const CountBadge = ({ count }: { count: number }) => (
  <span className="text-xs font-bold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1 tabular-nums">
    {count}
  </span>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const InvestorDashboardPage = () => {
  const { data: summary, isLoading } = useInvestorDashboardSummary();
  const { data: portfolio } = useInvestorPortfolio();

  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [yearInput, setYearInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(
    null,
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const isDateRangeActive = !!(fromDate || toDate);
  const isMonthYearActive = !!(selectedMonth || yearInput);
  const debouncedYear = useDebounce(yearInput, 500);

  useEffect(() => {
    if (portfolio?.length && !selectedProjectId) {
      setSelectedProjectId(portfolio[0].projectId);
    }
  }, [portfolio, selectedProjectId]);

  const filters = isDateRangeActive
    ? {
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      }
    : {
        month: selectedMonth || undefined,
        year: debouncedYear ? Number(debouncedYear) : undefined,
      };

  const { data: analytics, isLoading: analyticsLoading } = useProjectAnalytics(
    selectedProjectId,
    filters,
  );

  const transformedReports: MonthlyReport[] =
    analytics?.reports?.map((item) => ({
      ...item,
      keyAchievements: item.keyAchievements ?? "",
      challenges: item.challenges ?? "",
      netProfitLossType: item.netProfitLossAmount >= 0 ? "profit" : "loss",
    })) || [];

  const totalPages = Math.ceil(transformedReports.length / ITEMS_PER_PAGE);

  const paginatedReports = transformedReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProjectId, selectedMonth, debouncedYear, fromDate, toDate]);

  const uniqueProjects = portfolio
    ? (Array.from(
        new Map(portfolio.map((p: PortfolioItem) => [p.projectId, p])).values(),
      ) as PortfolioItem[])
    : [];

  const selectedProject = uniqueProjects.find(
    (p) => p.projectId === selectedProjectId,
  );
  const hasFilters = !!(yearInput || selectedMonth || fromDate || toDate);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28 hidden sm:block" />
        </div>
        <Skeleton className="h-80" />
        <Skeleton className="h-52" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Investor Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">
            Track your investments &amp; portfolio performance
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
          <TrendIcon />
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Total Invested */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Invested
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CoinIcon />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            ₹{summary?.totalInvested.toLocaleString("en-IN") ?? 0}
          </p>
        </div>

        {/* Active Investments */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <TrendIcon />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {summary?.activeInvestments ?? 0}
            <span className="text-sm font-medium text-slate-400 ml-1">
              positions
            </span>
          </p>
        </div>

        {/* Wallet Balance */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-800 to-indigo-950 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Wallet Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70">
              <WalletIcon />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ₹{(summary?.walletBalance ?? 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ── Analytics Section ── */}
      <SectionCard>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Title + project select */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-slate-800 text-base leading-tight">
                  Project Performance
                </h2>
                <div className="flex items-center gap-2 mt-1 min-w-0">
                  {/* Logo */}
                  {selectedProject?.logo ? (
                    <img
                      src={selectedProject.logo}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                      {selectedProject?.startupName?.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Name */}
                  <p className="text-xs text-slate-400 font-medium truncate">
                    {selectedProject?.startupName ?? "Select a project"}
                  </p>
                </div>
              </div>
              <select
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer shrink-0"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {uniqueProjects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    {p.startupName}
                  </option>
                ))}
              </select>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                disabled={isDateRangeActive}
                placeholder="Year"
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 w-24 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
              />
              <select
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
                value={selectedMonth}
                disabled={isDateRangeActive}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <input
                type="date"
                disabled={isMonthYearActive}
                max={toDate || undefined}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <input
                type="date"
                disabled={isMonthYearActive}
                min={fromDate || undefined}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              {hasFilters && (
                <button
                  className="text-xs text-slate-500 hover:text-slate-700 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all"
                  onClick={() => {
                    setYearInput("");
                    setSelectedMonth("");
                    setFromDate("");
                    setToDate("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-4 sm:p-5 min-h-[320px] flex items-center justify-center">
          {!selectedProjectId ? (
            <EmptyState message="Select a project to view analytics" />
          ) : analyticsLoading ? (
            <div className="w-full h-[300px] flex items-end gap-2 px-4">
              {[40, 70, 55, 90, 65, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-100 rounded-t-xl animate-pulse"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          ) : !analytics?.reports?.length ? (
            <EmptyState message="No reports found for the selected filters" />
          ) : (
            <div className="w-full">
              <AnalyticsChart data={analytics.reports} />
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Portfolio Table ── */}
      <SectionCard>
        <SectionHeader
          title="Your Investments"
          subtitle="All active portfolio positions"
          badge={<CountBadge count={portfolio?.length ?? 0} />}
        />
        <div className="divide-y divide-slate-50 px-2 py-1">
          {portfolio?.length ? (
            portfolio.map((item: PortfolioItem, i: number) => (
              <InvestmentRow
                key={`${item.projectId}-${i}`}
                item={item}
                index={i}
              />
            ))
          ) : (
            <EmptyState message="No investments found" />
          )}
        </div>
      </SectionCard>

      {/* ── Monthly Reports ── */}
      <SectionCard>
        <SectionHeader
          title="Monthly Reports"
          subtitle="Performance reports for your investments"
          badge={<CountBadge count={analytics?.reports?.length ?? 0} />}
        />
        <div className="p-4 sm:p-5">
          {transformedReports.length ? (
            <>
              <div className="space-y-2.5">
                {paginatedReports.map((item, i) => (
                  <ReportCard
                    key={i}
                    report={item}
                    onView={() => setSelectedReport(item)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setPage={setCurrentPage}
                />
              )}
            </>
          ) : (
            <EmptyState message="No reports found for the selected filters" />
          )}
        </div>
      </SectionCard>

      {/* ── Report Modal ── */}
      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default InvestorDashboardPage;
