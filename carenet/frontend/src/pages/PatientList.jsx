import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 bg-slate-800 rounded-xl" />
          <div className="h-96 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-slate-800 border border-red-500/50 rounded-2xl p-6 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Patients</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or Patient ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2 w-72 placeholder-slate-500"
        />
        <select
          value={riskLevel}
          onChange={(e) => { setRiskLevel(e.target.value); setPage(0); }}
          className="bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
        >
          <option value="">All risk levels</option>
          {RISK_LEVELS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={disease}
          onChange={(e) => { setDisease(e.target.value); setPage(0); }}
          className="bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
        >
          <option value="">All diseases</option>
          {DISEASES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by hospital..."
          value={hospital}
          onChange={(e) => { setHospital(e.target.value); setPage(0); }}
          className="bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2 w-48 placeholder-slate-500"
        />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        {pagePatients.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No patients match your filters. Try adjusting search or filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 text-sm border-b border-slate-700 bg-slate-800/80">
                    <th className="px-4 py-3 font-medium">Patient ID</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Age</th>
                    <th className="px-4 py-3 font-medium">Disease</th>
                    <th className="px-4 py-3 font-medium">Hospital</th>
                    <th className="px-4 py-3 font-medium">Treatment Stage</th>
                    <th className="px-4 py-3 font-medium">Risk Level</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagePatients.map((p) => (
                    <tr key={p._id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-slate-300 font-mono text-sm">{p.patientId}</td>
                      <td className="px-4 py-3 text-white">{p.name}</td>
                      <td className="px-4 py-3 text-slate-300">{p.age}</td>
                      <td className="px-4 py-3 text-slate-300">{p.disease}</td>
                      <td className="px-4 py-3 text-slate-300">{p.currentHospital}</td>
                      <td className="px-4 py-3 text-slate-300">{p.treatmentStage ?? 1}/4</td>
                      <td className="px-4 py-3">
                        <RiskBadge level={p.latestRiskLevel || "Unknown"} showIcon size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="rounded-xl bg-cyan-500/20 text-cyan-400 px-3 py-1.5 text-sm hover:bg-cyan-500/30 transition-colors"
                          onClick={() => navigate(`/patients/${p._id}`)}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
              <p className="text-slate-400 text-sm">
                Showing {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-xl bg-slate-700 text-white px-4 py-2 text-sm disabled:opacity-50 hover:bg-slate-600 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="rounded-xl bg-slate-700 text-white px-4 py-2 text-sm disabled:opacity-50 hover:bg-slate-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
