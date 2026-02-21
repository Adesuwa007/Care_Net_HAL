import { useState, useEffect, useCallback } from "react";
import {
    Activity,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertCircle,
    Trash2,
    LogIn,
    LogOut,
    UserPlus,
    Brain,
    ArrowLeftRight,
    Shield,
    ScanLine,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import api from "../api/axios";

const TYPE_BADGES = {
    LOGIN: { bg: "bg-green-500/20", text: "text-green-400" },
    LOGOUT: { bg: "bg-slate-500/20", text: "text-slate-400" },
    PATIENT_CREATED: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
    PATIENT_UPDATED: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
    RISK_ASSESSED: { bg: "bg-purple-500/20", text: "text-purple-400" },
    RECORD_TRANSFERRED: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
    SCHEME_ENROLLED: { bg: "bg-blue-500/20", text: "text-blue-400" },
    AADHAAR_SCANNED: { bg: "bg-orange-500/20", text: "text-orange-400" },
    PDF_GENERATED: { bg: "bg-slate-500/20", text: "text-slate-400" },
    PAGE_VISIT: { bg: "bg-slate-500/20", text: "text-slate-400" },
};

const TYPE_ICONS = {
    LOGIN: LogIn,
    LOGOUT: LogOut,
    PATIENT_CREATED: UserPlus,
    RISK_ASSESSED: Brain,
    RECORD_TRANSFERRED: ArrowLeftRight,
    SCHEME_ENROLLED: Shield,
    AADHAAR_SCANNED: ScanLine,
};

const STATUS_CONFIG = {
    SUCCESS: { icon: CheckCircle, color: "text-green-400" },
    FAILURE: { icon: XCircle, color: "text-red-400" },
    WARNING: { icon: AlertCircle, color: "text-yellow-400" },
};

const LOG_TYPES = [
    "ALL",
    "LOGIN",
    "LOGOUT",
    "PATIENT_CREATED",
    "PATIENT_UPDATED",
    "RISK_ASSESSED",
    "RECORD_TRANSFERRED",
    "SCHEME_ENROLLED",
    "AADHAAR_SCANNED",
];

const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) + ", " + d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export default function SystemLogs() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ stats: [], todayLogins: 0 });
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("ALL");
    const [filterUsername, setFilterUsername] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const limit = 20;

    const fetchLogs = useCallback(async () => {
        try {
            const params = { page, limit };
            if (filterType !== "ALL") params.type = filterType;
            if (filterUsername) params.username = filterUsername;
            if (filterDate) params.date = filterDate;
            const { data } = await api.get("/api/logs", { params });
            setLogs(data.logs);
            setTotal(data.total);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setLoading(false);
        }
    }, [page, filterType, filterUsername, filterDate]);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await api.get("/api/logs/stats");
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchLogs();
        fetchStats();
    }, [fetchLogs, fetchStats]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchLogs();
            fetchStats();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchLogs, fetchStats]);

    const handleClearLogs = async () => {
        if (!window.confirm("Are you sure you want to clear all logs?")) return;
        try {
            await api.delete("/api/logs/clear");
            setLogs([]);
            setTotal(0);
            fetchStats();
        } catch (err) {
            console.error("Failed to clear logs:", err);
        }
    };

    const getStatCount = (type) => {
        const found = stats.stats?.find((s) => s._id === type);
        return found ? found.count : 0;
    };

    const totalEvents = stats.stats?.reduce((sum, s) => sum + s.count, 0) || 0;
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);
    const totalPages = Math.ceil(total / limit);

    const statCards = [
        { label: "Today's Logins", value: stats.todayLogins || 0, icon: LogIn, color: "text-green-400" },
        { label: "Total Events (7d)", value: totalEvents, icon: Activity, color: "text-cyan-400" },
        { label: "Patients Created (7d)", value: getStatCount("PATIENT_CREATED"), icon: UserPlus, color: "text-blue-400" },
        { label: "Risk Assessments (7d)", value: getStatCount("RISK_ASSESSED"), icon: Brain, color: "text-purple-400" },
    ];

    return (
        <div className="p-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 animate-fadeInUp">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Logs</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Real-time activity monitoring and audit trail
                    </p>
                </div>
                <button
                    onClick={handleClearLogs}
                    className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl px-4 py-2 text-sm font-medium hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear All Logs
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6 animate-fadeInUp">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-white font-bold text-xl">{card.value}</p>
                            <p className="text-slate-400 text-sm">{card.label}</p>
                        </div>
                        <card.icon className={`w-8 h-8 ${card.color} opacity-50`} />
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6 animate-fadeInUp">
                <select
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                    className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm"
                >
                    {LOG_TYPES.map((t) => (
                        <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Filter by username"
                    value={filterUsername}
                    onChange={(e) => { setFilterUsername(e.target.value); setPage(1); }}
                    className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm"
                />
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
                    className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm"
                />
                <button
                    onClick={() => { setLoading(true); fetchLogs(); fetchStats(); }}
                    className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl px-4 py-2 text-sm font-medium hover:bg-cyan-500/30 transition-all flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Logs Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden animate-fadeInUp">
                {loading ? (
                    <div className="p-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-slate-700 animate-pulse rounded-xl mb-2" />
                        ))}
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Activity className="w-12 h-12 text-slate-600 mb-3" />
                        <p className="text-slate-400">No logs found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    User
                                </th>
                                <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => {
                                const badge = TYPE_BADGES[log.type] || TYPE_BADGES.PAGE_VISIT;
                                const statusCfg = STATUS_CONFIG[log.status] || STATUS_CONFIG.SUCCESS;
                                const StatusIcon = statusCfg.icon;
                                return (
                                    <tr
                                        key={log._id}
                                        className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                                            {formatTimestamp(log.timestamp)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`${badge.bg} ${badge.text} text-xs font-medium px-2.5 py-1 rounded-lg`}
                                            >
                                                {log.type.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-white text-sm">{log.username}</p>
                                            {log.role && (
                                                <p className="text-slate-400 text-xs">{log.role}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300 text-sm max-w-xs truncate">
                                            {log.description}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`flex items-center gap-1 ${statusCfg.color} text-xs font-medium`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {total > 0 && (
                <div className="flex items-center justify-between mt-4 animate-fadeInUp">
                    <p className="text-slate-400 text-sm">
                        Showing {startItem}-{endItem} of {total} logs
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm disabled:opacity-40 hover:bg-slate-700 transition-all flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <span className="text-slate-400 text-sm px-2">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm disabled:opacity-40 hover:bg-slate-700 transition-all flex items-center gap-1"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
