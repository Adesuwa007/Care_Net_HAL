import { useState, useEffect } from "react";
import { getPatients } from "../api/axios";
import { transferPatient } from "../api/axios";
import RiskBadge from "../components/RiskBadge";

export default function TransferRecords() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ newHospital: "", transferReason: "", receivingDoctor: "" });

  useEffect(() => {
    getPatients({})
      .then((res) => setPatients(Array.isArray(res) ? res : []))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? patients.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
          (p.patientId && p.patientId.toLowerCase().includes(search.toLowerCase()))
      )
    : patients;

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selected || !form.newHospital.trim()) return;
    setError(null);
    setTransferSuccess(null);
    setTransferLoading(true);
    try {
      const updated = await transferPatient(selected._id, form);
      setTransferSuccess({
        from: selected.currentHospital,
        to: form.newHospital,
        date: new Date(),
        patient: updated,
      });
      setSelected(updated);
      setForm({ newHospital: "", transferReason: "", receivingDoctor: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse flex gap-6">
          <div className="w-80 h-96 bg-slate-800 rounded-2xl" />
          <div className="flex-1 h-96 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Transfer Records</h1>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Search & Select Patient</h2>
          <input
            type="text"
            placeholder="Search by name or Patient ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2 placeholder-slate-500"
          />
          <div className="max-h-[420px] overflow-y-auto space-y-3">
            {filtered.map((p) => (
              <div
                key={p._id}
                onClick={() => {
                  setSelected(p);
                  setError(null);
                  setTransferSuccess(null);
                }}
                className={`rounded-2xl border p-4 cursor-pointer transition-colors ${
                  selected?._id === p._id
                    ? "bg-slate-700 border-cyan-500"
                    : "bg-slate-800 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-slate-400 text-sm">{p.patientId}</p>
                    <p className="text-slate-400 text-sm">{p.disease} · {p.currentHospital}</p>
                  </div>
                  <RiskBadge level={p.latestRiskLevel || "Unknown"} showIcon size="sm" />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-slate-400">No patients found.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Transfer Form</h2>
          {!selected ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-400">
              Select a patient from the left to transfer.
            </div>
          ) : (
            <>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-4">
                <p className="text-white font-medium">Selected: {selected.name}</p>
                <p className="text-slate-400 text-sm">{selected.patientId} · {selected.currentHospital}</p>
                <RiskBadge level={selected.latestRiskLevel || "Unknown"} showIcon size="sm" />
              </div>

              {transferSuccess ? (
                <div className="bg-slate-800 border border-green-500/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-green-500 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xl font-semibold">Transfer Complete</span>
                  </div>
                  <p className="text-slate-300">
                    From <strong className="text-white">{transferSuccess.from}</strong> → To{" "}
                    <strong className="text-white">{transferSuccess.to}</strong>
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    {transferSuccess.date.toLocaleString()}
                  </p>
                  <p className="text-cyan-400 text-sm mt-2">Medical history successfully transferred.</p>
                  {transferSuccess.patient?.latestRiskLevel && (
                    <p className="text-slate-400 text-sm mt-2">
                      Updated risk: <RiskBadge level={transferSuccess.patient.latestRiskLevel} showIcon size="sm" />{" "}
                      {transferSuccess.patient.latestRiskProbability}%
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setTransferSuccess(null)}
                    className="mt-4 rounded-xl bg-slate-700 text-white px-4 py-2 text-sm hover:bg-slate-600"
                  >
                    New Transfer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTransfer} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">New Hospital *</label>
                    <input
                      type="text"
                      value={form.newHospital}
                      onChange={(e) => setForm((f) => ({ ...f, newHospital: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Transfer Reason</label>
                    <textarea
                      value={form.transferReason}
                      onChange={(e) => setForm((f) => ({ ...f, transferReason: e.target.value }))}
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Receiving Doctor</label>
                    <input
                      type="text"
                      value={form.receivingDoctor}
                      onChange={(e) => setForm((f) => ({ ...f, receivingDoctor: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={transferLoading}
                    className="w-full rounded-xl bg-cyan-500 text-white py-3 font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50"
                  >
                    {transferLoading ? "Transferring..." : "Transfer Records"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
