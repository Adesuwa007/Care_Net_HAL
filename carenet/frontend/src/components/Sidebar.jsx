import { NavLink } from "react-router-dom";
import { Heart, Wifi, LayoutDashboard, Users, UserPlus, ArrowLeftRight } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/patients", icon: Users, label: "Patients" },
  { to: "/patients/new", icon: UserPlus, label: "Add Patient" },
  { to: "/transfer", icon: ArrowLeftRight, label: "Transfer Records" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen">
      <div className="p-6 flex items-center gap-2 border-b border-slate-800">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400">
          <Heart className="w-5 h-5" />
        </span>
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 text-slate-400">
          <Wifi className="w-4 h-4" />
        </span>
        <span className="text-white font-semibold text-lg">CARE-NET</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-slate-700 text-cyan-400 border-l-4 border-l-cyan-500"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <p className="text-slate-500 text-sm">HAL 4.0 Hackathon</p>
      </div>
    </aside>
  );
}
