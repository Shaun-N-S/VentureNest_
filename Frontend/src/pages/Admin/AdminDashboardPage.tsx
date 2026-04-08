import SummaryCard from "../../components/dashboard/SummaryCard";
import { useState } from "react";
import TopItem from "../../components/dashboard/TopItem";
import {
  useAdminDashboardGraph,
  useAdminDashboardSummary,
  useAdminDashboardTop,
} from "../../hooks/Admin/DashboardHooks";
import AdminRevenueChart from "../../components/dashboard/AdminRevenueChart";

const CoinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <circle cx="12" cy="12" r="9" />
    <path
      d="M12 7v1m0 8v1M9.5 9.5C9.5 8.67 10.67 8 12 8s2.5.67 2.5 1.5S13.33 11 12 11s-2.5.67-2.5 1.5S10.67 14 12 14s2.5-.67 2.5-1.5"
      strokeLinecap="round"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" />
    <circle cx="9" cy="7" r="4" />
    <path
      d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      strokeLinecap="round"
    />
  </svg>
);

const StartupIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InvestorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      d="M22 12h-4l-3 9L9 3l-3 9H2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DealIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
  </svg>
);

type MonthValue = number | undefined;

interface MonthOption {
  label: string;
  value: number | "";
}

const MONTHS: MonthOption[] = [
  { label: "All Months", value: "" },
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const AdminDashboardPage = () => {
  const { data: summary } = useAdminDashboardSummary();
  const { data: top } = useAdminDashboardTop();

  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<MonthValue>(undefined);
  const [type, setType] = useState<"subscription" | "commission">("commission");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: graph } = useAdminDashboardGraph({
    type,
    year: year ? Number(year) : undefined,
    month,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .dashboard-root {
          font-family: 'Sora', sans-serif;
        }
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .glass-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
        }
        .gold-accent { color: #b8860b; }
        .gold-bg { background: #d4a853; }
        .select-dark {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.10);
          color: #1e293b;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 13px;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 28px;
        }
        .select-dark:hover, .select-dark:focus {
          border-color: rgba(212,168,83,0.5);
          box-shadow: 0 0 0 3px rgba(212,168,83,0.08);
        }
        .select-dark option {
          background: #ffffff;
          color: #1e293b;
        }
        .input-dark {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.10);
          color: #1e293b;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 90px;
        }
        .input-dark::placeholder { color: #cbd5e1; }
        .input-dark:hover, .input-dark:focus {
          border-color: rgba(212,168,83,0.5);
          box-shadow: 0 0 0 3px rgba(212,168,83,0.08);
        }
        .type-pill {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.08);
          background: transparent;
          color: #94a3b8;
          transition: all 0.2s;
          font-family: 'Sora', sans-serif;
        }
        .type-pill.active-commission {
          background: linear-gradient(135deg, #d4a853, #b8860b);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 2px 8px rgba(212,168,83,0.25);
        }
        .type-pill.active-subscription {
          background: linear-gradient(135deg, #818cf8, #6366f1);
          color: white;
          border-color: transparent;
          box-shadow: 0 2px 8px rgba(99,102,241,0.2);
        }
        .type-pill:hover:not(.active-commission):not(.active-subscription) {
          border-color: rgba(0,0,0,0.15);
          color: #475569;
          background: rgba(0,0,0,0.03);
        }
        .stat-divider {
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.08), transparent);
        }
        .grid-bg {
          background-image: 
            linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glow-gold { box-shadow: 0 1px 4px rgba(0,0,0,0.05), 0 4px 20px rgba(212,168,83,0.08); }
        .glow-violet { box-shadow: 0 1px 4px rgba(0,0,0,0.05), 0 4px 20px rgba(99,102,241,0.08); }
        .shimmer-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,168,83,0.35), transparent);
        }
      `}</style>

      <div className="dashboard-root grid-bg min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-6 gold-bg rounded-full" />
                <span className="text-xs mono gold-accent tracking-[0.2em] uppercase">
                  VentureNest
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Platform analytics & investment insights
              </p>
            </div>
          </div>

          <div className="shimmer-line" />

          {/* ── SUMMARY CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <SummaryCard
              title="Total Users"
              value={summary?.totalUsers ?? 0}
              icon={<UsersIcon />}
              accent="blue"
              sub={`${summary?.totalInvestors ?? 0} investors`}
            />
            <SummaryCard
              title="Startups"
              value={summary?.totalProjects ?? 0}
              icon={<StartupIcon />}
              accent="violet"
              sub="Active projects"
            />
            <SummaryCard
              title="Total Revenue"
              value={`₹${(summary?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
              icon={<CoinIcon />}
              accent="emerald"
              sub={`₹${(summary?.commissionRevenue ?? 0).toLocaleString("en-IN")} commission`}
            />
            <SummaryCard
              title="Deals"
              value={`${(summary?.totalDealsCompleted ?? 0) + (summary?.totalDealsPartiallyPaid ?? 0)}`}
              icon={<DealIcon />}
              accent="gold"
              sub={`${summary?.totalDealsPartiallyPaid ?? 0} partial · ${summary?.totalDealsCompleted ?? 0} done`}
            />
          </div>

          {/* ── REVENUE SPLIT ── */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="flex-1 flex flex-col gap-1 sm:pr-6">
              <span className="text-xs text-slate-400 uppercase tracking-widest">
                Commission Revenue
              </span>
              <span className="text-2xl font-bold gold-accent mono">
                ₹{(summary?.commissionRevenue ?? 0).toLocaleString("en-IN")}
              </span>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: summary?.totalRevenue
                      ? `${((summary.commissionRevenue ?? 0) / summary.totalRevenue) * 100}%`
                      : "0%",
                    background: "linear-gradient(90deg,#d4a853,#b8860b)",
                  }}
                />
              </div>
            </div>
            <div className="stat-divider hidden sm:block mx-6" />
            <div className="flex-1 flex flex-col gap-1 sm:px-6">
              <span className="text-xs text-slate-400 uppercase tracking-widest">
                Subscription Revenue
              </span>
              <span className="text-2xl font-bold text-indigo-500 mono">
                ₹{(summary?.subscriptionRevenue ?? 0).toLocaleString("en-IN")}
              </span>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: summary?.totalRevenue
                      ? `${((summary.subscriptionRevenue ?? 0) / summary.totalRevenue) * 100}%`
                      : "0%",
                    background: "linear-gradient(90deg,#818cf8,#6366f1)",
                  }}
                />
              </div>
            </div>
            <div className="stat-divider hidden sm:block mx-6" />
            <div className="flex-1 flex flex-col gap-1 sm:pl-6">
              <span className="text-xs text-slate-400 uppercase tracking-widest">
                Total Revenue
              </span>
              <span className="text-2xl font-bold text-slate-900 mono">
                ₹{(summary?.totalRevenue ?? 0).toLocaleString("en-IN")}
              </span>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full w-full"
                  style={{
                    background: "linear-gradient(90deg,#14b8a6,#0d9488)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── GRAPH ── */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 text-base">
                  Revenue Analytics
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monthly breakdown by revenue type
                </p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <div
                  className="flex rounded-xl overflow-hidden gap-1 p-1"
                  style={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(0,0,0,0.02)",
                  }}
                >
                  <button
                    className={`type-pill ${type === "commission" ? "active-commission" : ""}`}
                    onClick={() => setType("commission")}
                  >
                    Commission
                  </button>
                  <button
                    className={`type-pill ${type === "subscription" ? "active-subscription" : ""}`}
                    onClick={() => setType("subscription")}
                  >
                    Subscription
                  </button>
                </div>

                <input
                  type="number"
                  placeholder={String(new Date().getFullYear())}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="input-dark"
                />

                <select
                  onChange={(e) =>
                    setMonth(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="select-dark"
                >
                  {MONTHS.map((m) => (
                    <option key={m.label} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="input-dark"
                  />

                  <span className="text-xs text-slate-400">to</span>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="input-dark"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {graph && <AdminRevenueChart data={graph} chartType={type} />}
            </div>
          </div>

          {/* ── TOP SECTION ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Startups */}
            <div className="glass-card rounded-2xl overflow-hidden glow-gold">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Top Startups</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    By total funding raised
                  </p>
                </div>
                <span className="text-slate-400">
                  <StartupIcon />
                </span>
              </div>
              <div className="p-4 sm:p-5 space-y-2">
                {top?.topStartups.map((s, i) => (
                  <TopItem
                    key={s.projectId}
                    index={i}
                    title={s.startupName}
                    value={`₹${s.totalFunding.toLocaleString("en-IN")}`}
                    avatarUrl={s.logoUrl}
                    variant="startup"
                  />
                ))}
                {(!top?.topStartups || top.topStartups.length === 0) && (
                  <p className="text-slate-400 text-sm text-center py-4">
                    No startups yet
                  </p>
                )}
              </div>
            </div>

            {/* Top Investors */}
            <div className="glass-card rounded-2xl overflow-hidden glow-violet">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Top Investors
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    By total amount invested
                  </p>
                </div>
                <span className="text-slate-400">
                  <InvestorIcon />
                </span>
              </div>
              <div className="p-4 sm:p-5 space-y-2">
                {top?.topInvestors.map((investor, idx) => (
                  <TopItem
                    key={investor.investorId}
                    index={idx}
                    title={investor.userName}
                    value={`₹${investor.totalInvested.toLocaleString("en-IN")}`}
                    avatarUrl={investor.profileImg}
                    variant="investor"
                  />
                ))}
                {(!top?.topInvestors || top.topInvestors.length === 0) && (
                  <p className="text-slate-400 text-sm text-center py-4">
                    No investors yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
