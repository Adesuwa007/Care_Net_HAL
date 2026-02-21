import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

const config = {
  High: {
    bg: "bg-red-500/20",
    text: "text-red-500",
    border: "border-red-500/40",
    icon: AlertTriangle,
  },
  Medium: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-500",
    border: "border-yellow-500/40",
    icon: AlertCircle,
  },
  Low: {
    bg: "bg-green-500/20",
    text: "text-green-500",
    border: "border-green-500/40",
    icon: CheckCircle,
  },
  Unknown: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    border: "border-slate-500/40",
    icon: AlertCircle,
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

export default function RiskBadge({ level = "Unknown", showIcon = true, size = "md" }) {
  const c = config[level] || config.Unknown;
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${c.bg} ${c.text} ${c.border} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{level}</span>
    </span>
  );
}
