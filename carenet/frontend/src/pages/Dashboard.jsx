import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, AlertTriangle, Percent, Activity } from "lucide-react";
import StatCard from "../components/StatCard";
import RiskChart from "../components/RiskChart";
import RiskBadge from "../components/RiskBadge";
import PatientCard from "../components/PatientCard";
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
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-800 rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-800 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-80 bg-slate-800 rounded-2xl" />
            <div className="h-80 bg-slate-800 rounded-2xl" />
          </div>
          <div className="h-64 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-slate-800 border border-red-500/50 rounded-2xl p-6 text-red-400">
          Failed to load analytics: {error}
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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          subtitle="Active records"
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="High Risk Patients"
          value={highRiskCount}
          subtitle="Require immediate attention"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Scheme Enrollment Rate"
          value={`${schemeEnrollmentRate}%`}
          subtitle="Patients with financial support"
          icon={Percent}
          color="green"
        />
        <StatCard
          title="Dropout Risk Rate"
          value={`${dropoutRiskRate}%`}
          subtitle="High risk share"
          icon={Activity}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <RiskChart
          highRisk={highRiskCount}
          mediumRisk={mediumRiskCount}
          lowRisk={lowRiskCount}
        />
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Recent High Risk Patients</h2>
          {recentHighRiskPatients.length === 0 ? (
            <p className="text-slate-400">No high-risk patients in the system.</p>
          ) : (
            <ul className="space-y-3">
              {recentHighRiskPatients.map((p) => (
                <li
                  key={p._id}
                  className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
                >
                  <div>
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-slate-400 text-sm">{p.disease} · {p.currentHospital}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiskBadge level={p.latestRiskLevel} showIcon size="sm" />
                    <button
                      type="button"
                      className="rounded-xl bg-cyan-500/20 text-cyan-400 px-3 py-1.5 text-sm hover:bg-cyan-500/30 transition-colors"
                      onClick={() => navigate(`/patients/${p._id}`)}
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Disease Breakdown</h2>
        {diseaseBreakdown.length === 0 ? (
          <p className="text-slate-400">No disease data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                  <th className="pb-3 font-medium">Disease</th>
                  <th className="pb-3 font-medium">Patient Count</th>
                  <th className="pb-3 font-medium">High Risk</th>
                  <th className="pb-3 font-medium">Proportion</th>
                </tr>
              </thead>
              <tbody>
                {diseaseBreakdown.map(({ disease, count, highRiskCount = 0 }) => {
                  const pct = totalPatients > 0 ? (count / totalPatients) * 100 : 0;
                  return (
                    <tr key={disease} className="border-b border-slate-700/50">
                      <td className="py-3 text-white">{disease}</td>
                      <td className="py-3 text-slate-300">{count}</td>
                      <td className="py-3 text-slate-300">{highRiskCount}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden max-w-[120px]">
                            <div
                              className="h-full bg-cyan-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-sm">{Math.round(pct)}%</span>
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
