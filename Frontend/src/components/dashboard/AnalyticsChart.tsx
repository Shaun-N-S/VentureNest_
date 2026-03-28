import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MONTH_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface DataPoint {
  month: string;
  year: number;
  revenue: number;
  expenditure: number;
  netProfitLossAmount: number;
}

interface Props {
  data: DataPoint[];
}

type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: {
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }[];
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>

      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between gap-4 mb-1"
        >
          <span className="flex items-center gap-1.5 text-gray-500">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: entry.color }}
            />
            {entry.name}
          </span>

          <span className="font-semibold text-gray-800">
            ₹{Number(entry.value).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month);
  });

  const formattedData = sorted.map((d) => ({
    name: `${d.month.slice(0, 3)} ${d.year}`,
    Revenue: d.revenue,
    Expenditure: d.expenditure,
    "Net P/L": d.netProfitLossAmount,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={formattedData}
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenditure" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.12} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            v >= 100000
              ? `₹${(v / 100000).toFixed(1)}L`
              : v >= 1000
                ? `₹${(v / 1000).toFixed(0)}K`
                : `₹${v}`
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "12px",
            color: "#64748b",
          }}
        />

        <Area
          type="monotone"
          dataKey="Revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone"
          dataKey="Net P/L"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorProfit)"
          dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone"
          dataKey="Expenditure"
          stroke="#f43f5e"
          strokeWidth={2}
          fill="url(#colorExpenditure)"
          dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
