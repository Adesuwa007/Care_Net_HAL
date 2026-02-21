import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
} from "recharts";
import api from "../api/axios";

const RISK_COLORS = { High: "#ef4444", Medium: "#eab308", Low: "#22c55e" };
const STAGE_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

const ChartCard = ({ title, subtitle, children, className = "" }) => (
    <div className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 ${className}`}>
        <h3 className="text-white font-bold mb-1">{title}</h3>
        <p className="text-slate-400 text-xs mb-4">{subtitle}</p>
        {children}
    </div>
);

const SkeletonCard = ({ className = "" }) => (
    <div className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 ${className}`}>
        <div className="h-5 w-48 bg-slate-700 animate-pulse rounded mb-2" />
        <div className="h-3 w-64 bg-slate-700 animate-pulse rounded mb-6" />
        <div className="h-52 bg-slate-700 animate-pulse rounded-xl" />
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
            <p className="text-slate-300 text-sm font-medium mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-sm" style={{ color: p.color }}>
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    );
};

export default function Analytics() {
    const [overview, setOverview] = useState(null);
    const [trends, setTrends] = useState([]);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = useCallback(async () => {
        try {
            const [overviewRes, trendsRes, stagesRes] = await Promise.all([
                api.get("/api/analytics/overview"),
                api.get("/api/analytics/trends"),
                api.get("/api/analytics/stage-breakdown"),
            ]);
            setOverview(overviewRes.data);
            setTrends(trendsRes.data);
            setStages(stagesRes.data);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Analytics fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading) {
        return (
            <div className="p-8 animate-fadeIn">
                <div className="mb-6">
                    <div className="h-8 w-56 bg-slate-700 animate-pulse rounded mb-2" />
                    <div className="h-4 w-80 bg-slate-700 animate-pulse rounded" />
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <SkeletonCard />
                    <SkeletonCard className="col-span-2" />
                </div>
            </div>
        );
    }

    // Prepare chart data
    const riskData = [
        { name: "High Risk", value: overview?.highRiskCount || 0, color: RISK_COLORS.High },
        { name: "Medium Risk", value: overview?.mediumRiskCount || 0, color: RISK_COLORS.Medium },
        { name: "Low Risk", value: overview?.lowRiskCount || 0, color: RISK_COLORS.Low },
    ];
    const totalPatients = overview?.totalPatients || 0;

    const enrolled = overview?.schemeEnrollmentRate
        ? Math.round((overview.schemeEnrollmentRate / 100) * totalPatients)
        : 0;
    const notEnrolled = totalPatients - enrolled;
    const enrollmentData = [
        { name: "Enrolled", value: enrolled, color: "#22c55e" },
        { name: "Not Enrolled", value: notEnrolled, color: "#ef4444" },
    ];

    const diseaseData = (overview?.diseaseBreakdown || []).map((d) => ({
        name: d.disease,
        count: d.count,
    }));

    const hospitalData = (overview?.hospitalBreakdown || []).map((h) => ({
        name: h.hospital.length > 20 ? h.hospital.slice(0, 18) + "…" : h.hospital,
        fullName: h.hospital,
        total: h.count,
        highRisk: h.highRiskCount,
    }));

    const radialData = stages.map((s, i) => ({
        name: s.label,
        count: s.count,
        fill: STAGE_COLORS[i],
    }));

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return percent > 0.05 ? (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    return (
        <div className="p-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 animate-fadeInUp">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Live data visualization across all patients and programs
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={() => { setLoading(true); fetchData(); }}
                        className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl px-4 py-2 text-sm font-medium hover:bg-cyan-500/30 transition-all flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Row 1: Donut + Line */}
            <div className="grid grid-cols-2 gap-6 mb-6 animate-fadeInUp">
                <ChartCard title="Patient Risk Distribution" subtitle="Current distribution across all patients">
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <ResponsiveContainer width={280} height={280}>
                                <PieChart>
                                    <Pie
                                        data={riskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        dataKey="value"
                                        animationDuration={1500}
                                        stroke="none"
                                    >
                                        {riskData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white">{totalPatients}</p>
                                    <p className="text-slate-400 text-xs">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-2">
                        {riskData.map((d) => (
                            <div key={d.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                <span className="text-slate-300 text-xs">
                                    {d.name}: {d.value} ({totalPatients > 0 ? Math.round((d.value / totalPatients) * 100) : 0}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard title="Weekly Risk Trend" subtitle="Risk level changes over the past 7 weeks">
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="highRisk"
                                name="High Risk"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ fill: "#ef4444", r: 4 }}
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey="mediumRisk"
                                name="Medium Risk"
                                stroke="#eab308"
                                strokeWidth={2}
                                dot={{ fill: "#eab308", r: 4 }}
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey="lowRisk"
                                name="Low Risk"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ fill: "#22c55e", r: 4 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Row 2: Disease + Hospital */}
            <div className="grid grid-cols-2 gap-6 mb-6 animate-fadeInUp">
                <ChartCard title="Disease Breakdown" subtitle="Patient count by disease category">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={diseaseData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} width={100} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="Patients" fill="#06b6d4" radius={[0, 6, 6, 0]} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Hospital Load Distribution" subtitle="Total patients and high risk per hospital">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={hospitalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#94a3b8", fontSize: 10, angle: -20 }}
                                interval={0}
                                height={60}
                            />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="total" name="Total Patients" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
                            <Bar dataKey="highRisk" name="High Risk" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Row 3: Enrollment Pie + Stage Radial */}
            <div className="grid grid-cols-3 gap-6 animate-fadeInUp">
                <ChartCard title="Scheme Enrollment" subtitle="Enrolled vs non-enrolled patients">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={enrollmentData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={renderCustomizedLabel}
                                labelLine={false}
                                animationDuration={1500}
                                stroke="none"
                            >
                                {enrollmentData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 mt-1">
                        {enrollmentData.map((d) => (
                            <div key={d.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                <span className="text-slate-300 text-xs">{d.name}: {d.value}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard title="Treatment Stage Distribution" subtitle="Patient count at each treatment stage" className="col-span-2">
                    <div className="flex items-center gap-8">
                        <ResponsiveContainer width="60%" height={260}>
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="20%"
                                outerRadius="90%"
                                data={radialData}
                                startAngle={180}
                                endAngle={0}
                            >
                                <RadialBar
                                    background={{ fill: "#1e293b" }}
                                    dataKey="count"
                                    animationDuration={1500}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-3">
                            {radialData.map((stage, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-md" style={{ backgroundColor: stage.fill }} />
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-medium">{stage.name}</p>
                                        <p className="text-slate-400 text-xs">{stage.count} patients</p>
                                    </div>
                                    <span className="text-white font-bold">{stage.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ChartCard>
            </div>
        </div>
    );
}
