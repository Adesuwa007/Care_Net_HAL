import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "cyan", trend }) {
  const colorClasses = {
    cyan: "text-cyan-400",
    red: "text-red-500",
    yellow: "text-yellow-500",
    green: "text-green-500",
  };
  const c = colorClasses[color] || colorClasses.cyan;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
                {trend >= 0 ? "+" : ""}{trend}%
              </span>
              <span className="text-slate-400 text-sm">vs last week</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center ${c}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
