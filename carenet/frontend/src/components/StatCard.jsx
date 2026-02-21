import { TrendingUp, TrendingDown } from "lucide-react";

const colorConfig = {
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    glow: "glow-cyan",
    gradient: "from-cyan-500/20 to-blue-500/10",
    iconBg: "bg-gradient-to-br from-cyan-500/30 to-blue-500/20",
  },
  red: {
    text: "text-red-500",
    bg: "bg-red-500/10",
    glow: "glow-red",
    gradient: "from-red-500/20 to-orange-500/10",
    iconBg: "bg-gradient-to-br from-red-500/30 to-orange-500/20",
  },
  yellow: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    glow: "glow-yellow",
    gradient: "from-yellow-500/20 to-orange-500/10",
    iconBg: "bg-gradient-to-br from-yellow-500/30 to-orange-500/20",
  },
  green: {
    text: "text-green-500",
    bg: "bg-green-500/10",
    glow: "glow-green",
    gradient: "from-green-500/20 to-emerald-500/10",
    iconBg: "bg-gradient-to-br from-green-500/30 to-emerald-500/20",
  },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color = "cyan", trend }) {
  const c = colorConfig[color] || colorConfig.cyan;

  return (
    <div
      className={`glass-card p-5 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-0.5 ${c.glow} group`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-extrabold mt-2 ${c.text}`}>{value}</p>
          {subtitle && (
            <p className="text-slate-500 text-xs mt-1.5 font-medium">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-3">
              {trend >= 0 ? (
                <div className="flex items-center gap-1 bg-green-500/10 rounded-full px-2 py-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500 text-xs font-semibold">+{trend}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-red-500/10 rounded-full px-2 py-0.5">
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-red-500 text-xs font-semibold">{trend}%</span>
                </div>
              )}
              <span className="text-slate-500 text-xs">vs last week</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center ${c.text} transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
