interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "blue" | "emerald" | "violet";
}

const accentMap = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    dot: "bg-blue-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
    dot: "bg-violet-500",
  },
};

const SummaryCard = ({ title, value, icon, accent = "blue" }: Props) => {
  const colors = accentMap[accent];

  return (
    <div className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Subtle background accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8 ${colors.dot}`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1 tracking-tight">
            {value}
          </h2>
        </div>
        <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.border} border`}>
          <span className={`${colors.text} w-5 h-5 block`}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;