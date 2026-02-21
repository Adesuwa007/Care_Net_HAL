import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, UserCircle } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { getPatients } from "../api/axios";

const PAGE_SIZE = 10;
const DISEASES = ["TB", "Diabetes", "Hypertension", "Maternal Care", "Cancer", "Other"];
const RISK_LEVELS = ["High", "Medium", "Low"];

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [disease, setDisease] = useState("");
  const [hospital, setHospital] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const filters = {};
    if (riskLevel) filters.riskLevel = riskLevel;
    if (disease) filters.disease = disease;
    if (hospital) filters.hospital = hospital;
    getPatients(filters)
      .then((res) => {
        if (!cancelled) setPatients(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [riskLevel, disease, hospital]);

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const s = search.toLowerCase();
    return patients.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(s)) ||
        (p.patientId && p.patientId.toLowerCase().includes(s))
    );
  }, [patients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pagePatients = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="p-8 animate-fadeIn">
        <div className="space-y-4">
          <div className="h-10 w-64 skeleton-shimmer rounded-xl" />
          <div className="h-12 skeleton-shimmer rounded-xl" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 skeleton-shimmer rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 animate-fadeInUp">
        <div className="glass-card p-6 border-red-500/30 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8 animate-fadeInUp">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Patients</h1>
          <p className="text-slate-400 mt-1">{filtered.length} patient{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <button
          onClick={() => navigate("/patients/new")}
          className="btn-premium bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm flex items-center gap-2"
        >
          <UserCircle className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 animate-fadeInUp delay-100">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 text-sm font-medium">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or Patient ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-10 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5 placeholder-slate-500 text-sm"
            />
          </div>
          <select
            value={riskLevel}
            onChange={(e) => { setRiskLevel(e.target.value); setPage(0); }}
            className="bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5 text-sm min-w-[140px]"
          >
            <option value="">All Risk Levels</option>
            {RISK_LEVELS.map((r) => (
              <option key={r} value={r}>{r} Risk</option>
            ))}
          </select>
          <select
            value={disease}
            onChange={(e) => { setDisease(e.target.value); setPage(0); }}
            className="bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5 text-sm min-w-[140px]"
          >
            <option value="">All Diseases</option>
            {DISEASES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filter hospital..."
            value={hospital}
            onChange={(e) => { setHospital(e.target.value); setPage(0); }}
            className="bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5 text-sm w-44 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fadeInUp delay-200">
        {pagePatients.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No patients match your filters</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700/50 bg-slate-800/30">
                    <th className="px-5 py-3.5 font-semibold">Patient ID</th>
                    <th className="px-5 py-3.5 font-semibold">Name</th>
                    <th className="px-5 py-3.5 font-semibold">Age</th>
                    <th className="px-5 py-3.5 font-semibold">Disease</th>
                    <th className="px-5 py-3.5 font-semibold">Hospital</th>
                    <th className="px-5 py-3.5 font-semibold">Stage</th>
                    <th className="px-5 py-3.5 font-semibold">Risk</th>
                    <th className="px-5 py-3.5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagePatients.map((p, i) => (
                    <tr
                      key={p._id}
                      className="border-b border-slate-700/20 hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/patients/${p._id}`)}
                      style={{ animationDelay: `${i * 0.03}s` }}
                    >
                      <td className="px-5 py-3.5 text-cyan-400 font-mono text-sm">{p.patientId}</td>
                      <td className="px-5 py-3.5 text-white font-medium">{p.name}</td>
                      <td className="px-5 py-3.5 text-slate-300 text-sm">{p.age}</td>
                      <td className="px-5 py-3.5">
                        <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded-lg">{p.disease}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 text-sm">{p.currentHospital}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${((p.treatmentStage ?? 1) / 4) * 100}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-xs">{p.treatmentStage ?? 1}/4</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <RiskBadge level={p.latestRiskLevel || "Unknown"} showIcon size="sm" />
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          className="btn-premium rounded-lg bg-cyan-500/15 text-cyan-400 px-3 py-1.5 text-xs font-medium hover:bg-cyan-500/25 transition-colors"
                          onClick={(e) => { e.stopPropagation(); navigate(`/patients/${p._id}`); }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-700/30 bg-slate-800/20">
              <p className="text-slate-500 text-sm">
                Showing <span className="text-slate-300 font-medium">{currentPage * PAGE_SIZE + 1}</span>–
                <span className="text-slate-300 font-medium">{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)}</span> of{" "}
                <span className="text-slate-300 font-medium">{filtered.length}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-700/50 text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-600/50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pageNum === currentPage
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "text-slate-400 hover:bg-slate-700/50"
                        }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="w-8 h-8 rounded-lg bg-slate-700/50 text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-600/50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
