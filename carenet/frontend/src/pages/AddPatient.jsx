import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight, Brain, Sparkles } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { createPatient } from "../api/axios";

const DISEASES = ["TB", "Diabetes", "Hypertension", "Maternal Care", "Cancer", "Other"];
const GENDERS = ["Male", "Female", "Other"];

const initialForm = {
  name: "",
  age: "",
  gender: "Male",
  phone: "",
  aadhaarLast4: "",
  disease: "TB",
  treatmentStage: 1,
  financialScore: 5,
  currentHospital: "",
  schemeEnrolled: false,
  initialDiagnosis: "",
};

export default function AddPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setError(null);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!form.name.trim() || !form.currentHospital.trim()) {
      setError("Name and Current Hospital are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        age: Number(form.age) || 0,
        gender: form.gender,
        phone: form.phone.trim() || undefined,
        aadhaarLast4: (form.aadhaarLast4 || "").trim().length === 4 ? form.aadhaarLast4.trim() : undefined,
        disease: form.disease,
        treatmentStage: Number(form.treatmentStage) || 1,
        financialScore: Number(form.financialScore) || 5,
        currentHospital: form.currentHospital.trim(),
        schemeEnrolled: Boolean(form.schemeEnrolled),
        initialDiagnosis: form.initialDiagnosis.trim() || undefined,
      };
      const data = await createPatient(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to add patient.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center border border-cyan-500/20">
          <UserPlus className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Add Patient</h1>
          <p className="text-slate-400 mt-0.5">Register a new patient and get instant AI risk assessment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="glass-card p-6 space-y-4 animate-fadeInUp delay-100">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1.5">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1.5">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">Aadhaar (Last 4 digits)</label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">XXXX - XXXX -</span>
              <input
                type="text"
                maxLength={4}
                value={form.aadhaarLast4 || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, aadhaarLast4: val });
                }}
                className="w-24 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5 text-center tracking-widest text-lg"
                placeholder="XXXX"
              />
            </div>
            <p className="text-slate-600 text-xs mt-1">Only last 4 digits stored — privacy protected</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4 animate-fadeInUp delay-200">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Medical Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1.5">Disease *</label>
              <select
                value={form.disease}
                onChange={(e) => handleChange("disease", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
              >
                {DISEASES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1.5">Current Hospital *</label>
              <input
                type="text"
                value={form.currentHospital}
                onChange={(e) => handleChange("currentHospital", e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">
              Treatment Stage ({form.treatmentStage}/4)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={4}
                value={form.treatmentStage}
                onChange={(e) => handleChange("treatmentStage", Number(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-2 rounded-full ${s <= form.treatmentStage
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                        : "bg-slate-700/50"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">
              Financial Score ({form.financialScore}/10)
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={form.financialScore}
              onChange={(e) => handleChange("financialScore", Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>Very Poor</span>
              <span>Wealthy</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="scheme"
              checked={form.schemeEnrolled}
              onChange={(e) => handleChange("schemeEnrolled", e.target.checked)}
              className="rounded bg-slate-700/50 border-slate-600 accent-cyan-500 w-4 h-4"
            />
            <label htmlFor="scheme" className="text-slate-300 text-sm font-medium">Scheme Enrolled</label>
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">Initial Diagnosis (optional)</label>
            <textarea
              value={form.initialDiagnosis}
              onChange={(e) => handleChange("initialDiagnosis", e.target.value)}
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm animate-scaleIn">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-premium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 font-semibold disabled:opacity-50 flex items-center gap-2 text-base"
        >
          {loading ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Add Patient & Assess Risk
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 max-w-2xl glass-card p-6 animate-scaleIn glow-cyan">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">AI Risk Assessment Result</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <RiskBadge level={result.latestRiskLevel || "Unknown"} showIcon size="lg" />
            <span className="text-3xl font-extrabold text-white">
              {result.latestRiskProbability ?? 0}%
            </span>
            <span className="text-slate-400">dropout risk</span>
          </div>
          {result.riskAssessments && result.riskAssessments.length > 0 && (
            <>
              <p className="text-slate-400 text-sm mb-2 font-medium">Primary reasons:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1">
                {(result.riskAssessments[result.riskAssessments.length - 1].primaryReasons || []).map((r, i) => (
                  <li key={i} className="text-sm">{r}</li>
                ))}
              </ul>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-cyan-400 text-sm mb-5">
                {result.riskAssessments[result.riskAssessments.length - 1].recommendation}
              </div>
            </>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/patients/${result._id}`)}
              className="btn-premium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 font-medium flex items-center gap-2"
            >
              View Full Profile
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setForm(initialForm);
              }}
              className="rounded-xl bg-slate-700/50 text-white px-5 py-2.5 hover:bg-slate-600/50 transition-colors font-medium"
            >
              Add Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
