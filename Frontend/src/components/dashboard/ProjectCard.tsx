import type { ProjectPerformance } from "../../types/dashboard";

interface Props {
  project: ProjectPerformance;
  isSelected?: boolean;
  onClick?: () => void;
}

const ProjectCard = ({ project, isSelected, onClick }: Props) => {
  const hasReport = !!project.latestReport;
  const isProfit =
    hasReport && (project.latestReport?.netProfitLossAmount ?? 0) >= 0;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-5 border transition-all duration-200 cursor-pointer group
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
            : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-md"
        }`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500 shadow shadow-blue-300" />
      )}

      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {project.startupName.slice(0, 2).toUpperCase()}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 text-base truncate leading-tight">
            {project.startupName}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {project.investorsCount} investor
            {project.investorsCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex gap-3 text-sm mt-3">
        <div className="flex-1 bg-gray-50 rounded-xl p-2.5">
          <p className="text-xs text-gray-400 mb-0.5">Investment</p>
          <p className="font-semibold text-gray-700">
            ₹{project.totalInvestment.toLocaleString("en-IN")}
          </p>
        </div>

        {hasReport ? (
          <div className="flex-1 bg-gray-50 rounded-xl p-2.5">
            <p className="text-xs text-gray-400 mb-0.5">
              {project.latestReport!.month} {project.latestReport!.year}
            </p>
            <p
              className={`font-semibold text-sm ${isProfit ? "text-emerald-600" : "text-red-500"}`}
            >
              {isProfit ? "▲" : "▼"} ₹
              {Math.abs(
                project.latestReport!.netProfitLossAmount,
              ).toLocaleString("en-IN")}
            </p>
          </div>
        ) : (
          <div className="flex-1 bg-gray-50 rounded-xl p-2.5 flex items-center justify-center">
            <p className="text-xs text-gray-400 italic">No report yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
