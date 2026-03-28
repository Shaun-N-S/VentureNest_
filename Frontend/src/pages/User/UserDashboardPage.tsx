import {
  useProjectAnalytics,
  useUserDashboard,
} from "../../hooks/Dashboard/dashboardHooks";
import SummaryCard from "../../components/dashboard/SummaryCard";
import ProjectCard from "../../components/dashboard/ProjectCard";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/Debounce/useDebounce";

// ─── Icons (inline SVG to avoid extra deps) ────────────────────────────────
const FolderIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
    />
  </svg>
);
const CoinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 7v1m0 8v1m-3-5h6" />
  </svg>
);
const PeopleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
    />
    <circle cx="9" cy="7" r="4" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
    />
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

// ─── Skeleton loader ────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

// ─── Main Component ──────────────────────────────────────────────────────────
const UserDashboardPage = () => {
  const { data, isLoading } = useUserDashboard();

  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [yearInput, setYearInput] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const debouncedYear = useDebounce(yearInput, 500);

  // Auto-select first project
  useEffect(() => {
    if (data?.projects.length && !selectedProjectId) {
      setSelectedProjectId(data.projects[0].projectId);
    }
  }, [data]);

  const filters = {
    month: selectedMonth || undefined,
    year: debouncedYear ? Number(debouncedYear) : undefined,
  };

  const { data: analytics, isLoading: analyticsLoading } = useProjectAnalytics(
    selectedProjectId,
    filters,
  );

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center text-gray-400">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm mt-1">Check back later</p>
        </div>
      </div>
    );
  }

  const selectedProject = data.projects.find(
    (p) => p.projectId === selectedProjectId,
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Overview of your portfolio
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Projects"
          value={data.totalProjects}
          icon={<FolderIcon />}
          accent="blue"
        />
        <SummaryCard
          title="Total Investment"
          value={`₹${data.totalInvestment.toLocaleString("en-IN")}`}
          icon={<CoinIcon />}
          accent="emerald"
        />
        <SummaryCard
          title="Total Investors"
          value={data.totalInvestors}
          icon={<PeopleIcon />}
          accent="violet"
        />
      </div>

      {/* ── Analytics Section ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Chart Header + Filters */}
        <div className="p-4 sm:p-5 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Left: title + project selector */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div>
                <h2 className="font-semibold text-gray-800 text-base leading-tight">
                  Performance
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedProject?.startupName ?? "Select a project"}
                </p>
              </div>

              {/* Project dropdown */}
              <select
                className="ml-auto sm:ml-2 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {data.projects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    {p.startupName}
                  </option>
                ))}
              </select>
            </div>

            {/* Right: filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Year input with debounce */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Year"
                  className="text-sm border border-gray-200 rounded-lg pl-2.5 pr-2.5 py-1.5 w-24 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                />
              </div>

              {/* Month selector */}
              <select
                className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {/* Clear filters */}
              {(yearInput || selectedMonth) && (
                <button
                  className="text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors"
                  onClick={() => {
                    setYearInput("");
                    setSelectedMonth("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chart body */}
        <div className="p-4 sm:p-5 min-h-[320px] flex items-center justify-center">
          {!selectedProjectId ? (
            <EmptyState message="Select a project to view analytics" />
          ) : analyticsLoading ? (
            <div className="w-full h-[300px] flex items-end gap-2 px-4">
              {[40, 70, 55, 90, 65, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-100 rounded-t-lg animate-pulse"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          ) : !analytics?.reports.length ? (
            <EmptyState message="No reports found for the selected filters" />
          ) : (
            <div className="w-full">
              <AnalyticsChart data={analytics.reports} />
            </div>
          )}
        </div>
      </div>

      {/* ── Project List ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">
            Your Projects
          </h2>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">
            {data.projects.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.projects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
              isSelected={project.projectId === selectedProjectId}
              onClick={() => setSelectedProjectId(project.projectId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Helper ──
const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-8">
    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={1.5}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export default UserDashboardPage;
