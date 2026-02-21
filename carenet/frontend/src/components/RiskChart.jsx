import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = {
  High: "#ef4444",
  Medium: "#eab308",
  Low: "#22c55e",
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
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 h-80">
      <div className="relative w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value, entry) => (
                <span className="text-slate-300 text-sm">
                  {value}: {entry.payload.value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{total}</p>
            <p className="text-slate-400 text-sm">Total Patients</p>
          </div>
        </div>
      </div>
    </div>
  );
}
