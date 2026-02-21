import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  High: "#ef4444",
  Medium: "#eab308",
  Low: "#22c55e",
};

const GRADIENTS = {
  High: ["#ef4444", "#f97316"],
  Medium: ["#eab308", "#f59e0b"],
  Low: ["#22c55e", "#06b6d4"],
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="glass-card px-3 py-2 shadow-lg">
      <p className="text-white text-sm font-semibold">{d.name}</p>
      <p className="text-slate-400 text-xs">
        {d.value} patient{d.value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default function RiskChart({ highRisk = 0, mediumRisk = 0, lowRisk = 0 }) {
  const total = highRisk + mediumRisk + lowRisk;
  const data = [
    { name: "High Risk", value: highRisk, color: COLORS.High },
    { name: "Medium Risk", value: mediumRisk, color: COLORS.Medium },
    { name: "Low Risk", value: lowRisk, color: COLORS.Low },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    data.push({ name: "No data", value: 1, color: "#64748b" });
  }

  return (
    <div className="glass-card p-5 h-80 glow-cyan">
      <h2 className="text-white font-semibold text-lg mb-2">Risk Distribution</h2>
      <div className="relative w-full h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {Object.entries(GRADIENTS).map(([key, [start, end]]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={start} />
                  <stop offset="100%" stopColor={end} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name.includes("High")
                      ? "url(#gradient-High)"
                      : entry.name.includes("Medium")
                        ? "url(#gradient-Medium)"
                        : entry.name.includes("Low")
                          ? "url(#gradient-Low)"
                          : entry.color
                  }
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value, entry) => (
                <span className="text-slate-300 text-sm font-medium">
                  {value}: <span className="text-white font-bold">{entry.payload.value}</span>
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: "2rem" }}>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">{total}</p>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-0.5">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
