import { AlertTriangle, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";

const config = {
  High: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
    icon: AlertTriangle,
    glow: "shadow-red-500/10",
  },
  Medium: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    icon: AlertCircle,
    glow: "shadow-yellow-500/10",
  },
  Low: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    border: "border-green-500/30",
    icon: CheckCircle,
    glow: "shadow-green-500/10",
  },
  Unknown: {
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    border: "border-slate-500/30",
    icon: ShieldAlert,
    glow: "",
  },
};

const sizeClasses = {
  sm: "px-2.5 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

export default function RiskBadge({ level = "Unknown", showIcon = true, size = "md" }) {
  const c = config[level] || config.Unknown;
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium transition-all duration-200 ${c.bg} ${c.text} ${c.border} ${sizeClasses[size]} ${c.glow ? `shadow-sm ${c.glow}` : ""}`}
    >
      {showIcon && <Icon className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} shrink-0`} />}
      <span>{level}</span>
    </span>
  );
}
