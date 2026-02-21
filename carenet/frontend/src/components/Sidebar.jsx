import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Wifi,
  LayoutDashboard,
  Users,
  UserPlus,
  ArrowLeftRight,
  BookOpen,
  LogOut,
  ChevronRight,
  BarChart3,
  MapPin,
  Activity,
} from "lucide-react";
import { logoutUser } from "../api/axios";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", description: "Overview & analytics" },
  { to: "/analytics", icon: BarChart3, label: "Analytics", description: "Live charts & insights" },
  { to: "/patients", icon: Users, label: "Patients", description: "Browse all patients" },
  { to: "/patients/new", icon: UserPlus, label: "Add Patient", description: "Register new patient" },
  { to: "/transfer", icon: ArrowLeftRight, label: "Transfers", description: "Hospital transfers" },
  { to: "/nearby", icon: MapPin, label: "Nearby Services", description: "Pharmacies & emergency" },
  { to: "/schemes", icon: BookOpen, label: "Schemes", description: "Government programs" },
  { to: "/logs", icon: Activity, label: "System Logs", description: "Activity audit trail" },
];

const getUserInitials = (username) => {
  if (!username) return "?";
  return username.slice(0, 2).toUpperCase();
};

const roleColors = {
  Admin: "from-purple-500 to-indigo-600",
  Doctor: "from-cyan-500 to-blue-600",
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored) user = JSON.parse(stored);
  } catch (_) { }

  const handleLogout = async () => {
    if (user) {
      await logoutUser(user.username, user.role);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/login");
  };

  return (
    <aside className="w-72 shrink-0 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/60 flex flex-col min-h-screen">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Heart className="w-5 h-5 text-white" />
            <Wifi className="w-3 h-3 text-white/80 absolute bottom-1 right-1" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">CARE-NET</span>
            <p className="text-slate-500 text-[11px] font-medium">AI Healthcare Platform</p>
          </div>
        </div>

        {/* User card */}
        {user && (
          <div className="glass-card p-3 flex items-center gap-3 mt-1">
            <div
              className={`w-9 h-9 rounded-lg bg-gradient-to-br ${roleColors[user.role] || roleColors.Doctor
                } flex items-center justify-center text-white text-xs font-bold shadow-md`}
            >
              {getUserInitials(user.username)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.username}</p>
              <p className="text-cyan-400 text-xs font-medium">{user.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-3 px-3">
          Navigation
        </p>
        {navItems.map(({ to, icon: Icon, label, description }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent"
              }`
            }
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${location.pathname === to || (to !== "/" && location.pathname.startsWith(to))
                ? "bg-cyan-500/20"
                : "bg-slate-800/50 group-hover:bg-slate-700/50"
                }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium block">{label}</span>
              <span className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors block truncate">
                {description}
              </span>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-all duration-200 ${location.pathname === to || (to !== "/" && location.pathname.startsWith(to))
                ? "opacity-100 text-cyan-500"
                : "opacity-0 group-hover:opacity-50"
                }`}
            />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/60 space-y-3">
        <button
          type="button"
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl px-4 py-2.5 transition-all duration-200 text-sm"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium">Sign Out</span>
        </button>
        <div className="px-3">
          <p className="text-slate-600 text-[10px] font-medium uppercase tracking-wider">
            HAL 4.0 Hackathon
          </p>
        </div>
      </div>
    </aside>
  );
}

