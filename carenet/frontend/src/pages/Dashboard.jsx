import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, AlertTriangle, Percent, Activity, ArrowRight, Stethoscope } from "lucide-react";
import StatCard from "../components/StatCard";
import RiskChart from "../components/RiskChart";
import RiskBadge from "../components/RiskBadge";
import { getAnalytics } from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAnalytics()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6 animate-fadeIn">
          <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 skeleton-shimmer rounded-2xl" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-80 skeleton-shimmer rounded-2xl" />
            <div className="h-80 skeleton-shimmer rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 animate-fadeInUp">
        <div className="glass-card p-6 border-red-500/30 text-red-400">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <span>Failed to load analytics: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  const {
    totalPatients = 0,
    highRiskCount = 0,
    mediumRiskCount = 0,
    lowRiskCount = 0,
    dropoutRiskRate = 0,
    schemeEnrollmentRate = 0,
    diseaseBreakdown = [],
    recentHighRiskPatients = [],
  } = data;

  return (
    <div className="p-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fadeInUp">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">AI-powered patient analytics overview</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Live Data</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Patients", value: totalPatients, subtitle: "Active records", icon: Users, color: "cyan" },
          { title: "High Risk", value: highRiskCount, subtitle: "Require attention", icon: AlertTriangle, color: "red" },
          { title: "Scheme Enrollment", value: `${schemeEnrollmentRate}%`, subtitle: "Financial support", icon: Percent, color: "green" },
          { title: "Dropout Risk Rate", value: `${dropoutRiskRate}%`, subtitle: "High risk share", icon: Activity, color: "yellow" },
        ].map((card, i) => (
          <div key={card.title} className="animate-fadeInUp" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
            <StatCard {...card} />
          </div>
        ))}
      </div>

      {/* Charts + High Risk */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="animate-fadeInUp delay-300">
          <RiskChart
            highRisk={highRiskCount}
            mediumRisk={mediumRiskCount}
            lowRisk={lowRiskCount}
          />
        </div>
        <div className="glass-card p-5 animate-fadeInUp delay-400">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Recent High Risk</h2>
            <span className="text-xs text-slate-500 bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full font-medium">
              {recentHighRiskPatients.length} patients
            </span>
          </div>
          {recentHighRiskPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Stethoscope className="w-10 h-10 mb-3 opacity-30" />
              <p>No high-risk patients detected</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentHighRiskPatients.map((p, i) => (
                <li
                  key={p._id}
                  className="flex items-center justify-between py-3 px-3 rounded-xl border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer"
                  style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                  onClick={() => navigate(`/patients/${p._id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 text-xs font-bold">
                      {(p.latestRiskProbability ?? 0)}%
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{p.name}</p>
                      <p className="text-slate-500 text-xs">{p.disease} · {p.currentHospital}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={p.latestRiskLevel} showIcon size="sm" />
                    <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Disease Breakdown Table */}
      <div className="glass-card p-5 animate-fadeInUp delay-400">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Disease Breakdown</h2>
          <span className="text-xs text-slate-500">{diseaseBreakdown.length} categories</span>
        </div>
        {diseaseBreakdown.length === 0 ? (
          <p className="text-slate-500 py-8 text-center">No disease data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700/50">
                  <th className="pb-3 font-semibold">Disease</th>
                  <th className="pb-3 font-semibold">Patients</th>
                  <th className="pb-3 font-semibold">High Risk</th>
                  <th className="pb-3 font-semibold w-48">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {diseaseBreakdown.map(({ disease, count, highRiskCount = 0 }, i) => {
                  const pct = totalPatients > 0 ? (count / totalPatients) * 100 : 0;
                  return (
                    <tr
                      key={disease}
                      className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors"
                      style={{ animationDelay: `${0.6 + i * 0.05}s` }}
                    >
                      <td className="py-3.5 text-white font-medium text-sm">{disease}</td>
                      <td className="py-3.5 text-slate-300 text-sm">{count}</td>
                      <td className="py-3.5">
                        <span className={`text-sm font-medium ${highRiskCount > 0 ? "text-red-400" : "text-slate-400"}`}>
                          {highRiskCount}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden max-w-[140px]">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-xs font-mono w-8 text-right">{Math.round(pct)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
