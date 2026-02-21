import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RiskBadge from "../components/RiskBadge";
import { createPatient } from "../api/axios";

const DISEASES = ["TB", "Diabetes", "Hypertension", "Maternal Care", "Cancer", "Other"];
const GENDERS = ["Male", "Female", "Other"];

const initialForm = {
  name: "",
  age: "",
  gender: "Male",
  phone: "",
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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Add Patient</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Age</label>
            <input
              type="number"
              min={1}
              max={120}
              value={form.age}
              onChange={(e) => handleChange("age", e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Disease *</label>
            <select
              value={form.disease}
              onChange={(e) => handleChange("disease", e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
            >
              {DISEASES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Current Hospital *</label>
            <input
              type="text"
              value={form.currentHospital}
              onChange={(e) => handleChange("currentHospital", e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Treatment Stage (1–4)</label>
          <input
            type="range"
            min={1}
            max={4}
            value={form.treatmentStage}
            onChange={(e) => handleChange("treatmentStage", Number(e.target.value))}
            className="w-full"
          />
          <span className="text-slate-400 text-sm">Stage {form.treatmentStage}</span>
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">
            Financial Score (1 = Very Poor → 10 = Wealthy)
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={form.financialScore}
            onChange={(e) => handleChange("financialScore", Number(e.target.value))}
            className="w-full"
          />
          <span className="text-slate-400 text-sm">{form.financialScore}/10</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="scheme"
            checked={form.schemeEnrolled}
            onChange={(e) => handleChange("schemeEnrolled", e.target.checked)}
            className="rounded bg-slate-700 border-slate-600"
          />
          <label htmlFor="scheme" className="text-slate-400">Scheme Enrolled</label>
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Initial Diagnosis (optional)</label>
          <textarea
            value={form.initialDiagnosis}
            onChange={(e) => handleChange("initialDiagnosis", e.target.value)}
            rows={3}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-cyan-500 text-white px-6 py-3 font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            "Add Patient"
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI Risk Result</h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <RiskBadge level={result.latestRiskLevel || "Unknown"} showIcon size="lg" />
            <span className="text-2xl font-bold text-white">
              {result.latestRiskProbability ?? 0}% dropout risk
            </span>
          </div>
          {result.riskAssessments && result.riskAssessments.length > 0 && (
            <>
              <p className="text-slate-400 text-sm mb-1">Primary reasons:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                {(result.riskAssessments[result.riskAssessments.length - 1].primaryReasons || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <p className="text-slate-400 text-sm mb-1">Recommendation:</p>
              <p className="text-cyan-400 bg-cyan-500/10 rounded-xl p-3 mb-4">
                {result.riskAssessments[result.riskAssessments.length - 1].recommendation}
              </p>
            </>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/patients/${result._id}`)}
              className="rounded-xl bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600 transition-colors"
            >
              View Full Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setForm(initialForm);
              }}
              className="rounded-xl bg-slate-700 text-white px-4 py-2 hover:bg-slate-600 transition-colors"
            >
              Add Another Patient
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
