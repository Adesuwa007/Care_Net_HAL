import { useState, useEffect } from "react";
import { ArrowLeftRight, Search, ArrowRight, Building2 } from "lucide-react";
import { getPatients, transferPatient } from "../api/axios";

export default function TransferRecords() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ newHospital: "", transferReason: "", receivingDoctor: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPatients()
      .then((res) => setPatients(Array.isArray(res) ? res : []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) => {
    const s = search.toLowerCase();
    return (
      !search ||
      (p.name && p.name.toLowerCase().includes(s)) ||
      (p.patientId && p.patientId.toLowerCase().includes(s))
    );
  });

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selected || !form.newHospital.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await transferPatient(selected._id, form);
      setSuccess(`${updated.name} transferred to ${form.newHospital}`);
      setSelected(null);
      setForm({ newHospital: "", transferReason: "", receivingDoctor: "" });
      // Refresh
      const fresh = await getPatients();
      setPatients(Array.isArray(fresh) ? fresh : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8 animate-fadeInUp">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 flex items-center justify-center border border-purple-500/20">
          <ArrowLeftRight className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Transfer Records</h1>
          <p className="text-slate-400 mt-0.5">Transfer patient records between hospitals</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-6 text-sm animate-scaleIn">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm animate-scaleIn">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Patient selector */}
        <div className="glass-card p-5 animate-fadeInUp delay-100">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            1. Select Patient
          </h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5 placeholder-slate-500 text-sm"
            />
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 skeleton-shimmer rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filtered.slice(0, 20).map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => setSelected(p)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 border ${selected?._id === p._id
                      ? "bg-cyan-500/15 border-cyan-500/30 text-white"
                      : "border-slate-700/30 hover:bg-slate-800/50 text-slate-300"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-slate-500 text-xs">
                        {p.patientId} · {p.disease}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{p.currentHospital}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Transfer form */}
        <div className="glass-card p-5 animate-fadeInUp delay-200">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            2. Transfer Details
          </h2>

          {selected ? (
            <div>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-5 border border-cyan-500/20">
                <p className="text-white font-semibold">{selected.name}</p>
                <p className="text-slate-400 text-sm">
                  Currently at: <span className="text-cyan-400">{selected.currentHospital}</span>
                </p>
              </div>

              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1.5">New Hospital *</label>
                  <input
                    type="text"
                    value={form.newHospital}
                    onChange={(e) => setForm({ ...form, newHospital: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1.5">Reason for Transfer</label>
                  <textarea
                    value={form.transferReason}
                    onChange={(e) => setForm({ ...form, transferReason: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1.5">Receiving Doctor</label>
                  <input
                    type="text"
                    value={form.receivingDoctor}
                    onChange={(e) => setForm({ ...form, receivingDoctor: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-premium w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    <>
                      Initiate Transfer
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <ArrowLeftRight className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium">Select a patient to transfer</p>
              <p className="text-sm mt-1">Choose from the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
