import type { PieChartData } from "@/types/adminDashboardTypes";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  title: string;
  data: { name: string; value: number }[];
}

const COLORS = ["#6366f1", "#14b8a6", "#d4a853", "#8b5cf6", "#f97316"];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: PieChartData[];
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];

  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700">{item.name}</p>
      <p className="text-gray-500">
        ₹{Number(item.value).toLocaleString("en-IN")}
      </p>
    </div>
  );
};

const AdminPieChart = ({ title, data }: Props) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Distribution based on funding
        </p>
      </div>

      {/* Chart */}
      <div className="h-64 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* 🔥 Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-bold text-gray-800">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((item, idx) => {
          const percentage = total
            ? ((item.value / total) * 100).toFixed(1)
            : "0";

          return (
            <div
              key={idx}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: COLORS[idx % COLORS.length],
                  }}
                />
                <span className="text-gray-600">{item.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500">{percentage}%</span>
                <span className="font-semibold text-gray-800">
                  ₹{item.value.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPieChart;
