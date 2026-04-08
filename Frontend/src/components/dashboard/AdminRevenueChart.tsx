import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface MonthlyRevenue {
  month: string;
  amount: number;
}

interface Props {
  data: MonthlyRevenue[];
  chartType?: "subscription" | "commission";
}

interface TooltipPayloadItem {
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const commissionColors = {
  stroke: "#b8860b",
  gradientStart: "#d4a853",
  gradientEnd: "#f5dfa0",
};
const subscriptionColors = {
  stroke: "#6366f1",
  gradientStart: "#818cf8",
  gradientEnd: "#c7d2fe",
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12px",
        fontFamily: "'Sora', sans-serif",
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "4px",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
          fontSize: "14px",
          color: payload[0].color,
        }}
      >
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default function AdminRevenueChart({
  data,
  chartType = "commission",
}: Props) {
  const colors =
    chartType === "subscription" ? subscriptionColors : commissionColors;
  const gradientId = `gradient-${chartType}`;

  const formattedData = data.map((d) => ({
    name: d.month,
    Revenue: d.amount,
  }));

  const maxVal = Math.max(...formattedData.map((d) => d.Revenue), 1);

  return (
    <div>
      {/* Mini stat row */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Peak Month
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              fontWeight: 600,
              color: colors.stroke,
              marginTop: "2px",
            }}
          >
            {formattedData.find((d) => d.Revenue === maxVal)?.name ?? "—"}
          </p>
        </div>
        <div>
          <p
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Peak Amount
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              fontWeight: 600,
              color: "#0f172a",
              marginTop: "2px",
            }}
          >
            ₹{maxVal.toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <p
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Active Months
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              fontWeight: 600,
              color: "#0f172a",
              marginTop: "2px",
            }}
          >
            {formattedData.filter((d) => d.Revenue > 0).length}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={formattedData}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colors.gradientStart}
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor={colors.gradientEnd}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0,0,0,0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{
              fontSize: 11,
              fill: "#94a3b8",
              fontFamily: "'Sora', sans-serif",
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fontSize: 11,
              fill: "#94a3b8",
              fontFamily: "'JetBrains Mono', monospace",
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 100000
                ? `₹${(v / 100000).toFixed(1)}L`
                : v >= 1000
                  ? `₹${(v / 1000).toFixed(0)}K`
                  : `₹${v}`
            }
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="Revenue"
            stroke={colors.stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={{ r: 3, fill: colors.stroke, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: colors.stroke,
              strokeWidth: 2,
              stroke: "rgba(0,0,0,0.1)",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
