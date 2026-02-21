import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { X, CheckCircle } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { getPatient, assessPatient, getSchemes, enrollScheme, addAppointment, getTransferHistory, transferPatient } from "../api/axios";

export default function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessing, setAssessing] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({ date: "", type: "checkup", status: "scheduled", notes: "" });
  const [transferForm, setTransferForm] = useState({ newHospital: "", transferReason: "", receivingDoctor: "" });

  const loadPatient = () => {
    if (!id) return;
    getPatient(id)
      .then(setPatient)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadPatient();
  }, [id]);

  useEffect(() => {
    if (!patient?._id) return;
    getSchemes(patient._id).then(setSchemes).catch(() => setSchemes([]));
    getTransferHistory(patient._id).then(setTransferHistory).catch(() => setTransferHistory([]));
  }, [patient?._id]);

  const handleAssess = async () => {
    setAssessing(true);
    try {
      const updated = await assessPatient(id);
      setPatient(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setAssessing(false);
    }
  };

  const handleEnroll = async (schemeName) => {
    try {
      const updated = await enrollScheme(id, schemeName);
      setPatient(updated);
      const list = await getSchemes(id);
      setSchemes(list);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const updated = await addAppointment(id, {
        date: appointmentForm.date || new Date().toISOString().slice(0, 16),
        type: appointmentForm.type,
        status: appointmentForm.status,
        notes: appointmentForm.notes,
      });
      setPatient(updated);
      setAppointmentForm({ date: "", type: "checkup", status: "scheduled", notes: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferForm.newHospital.trim()) return;
    try {
      const updated = await transferPatient(id, transferForm);
      setPatient(updated);
      setTransferModal(false);
      setTransferForm({ newHospital: "", transferReason: "", receivingDoctor: "" });
      getTransferHistory(id).then(setTransferHistory).catch(() => {});
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse grid grid-cols-3 gap-6">
          <div className="h-64 bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-8">
        <div className="bg-slate-800 border border-red-500/50 rounded-2xl p-6 text-red-400">
          {error || "Patient not found."}
        </div>
      </div>
    );
  }

  const lastAssessment = patient.riskAssessments?.length
    ? patient.riskAssessments[patient.riskAssessments.length - 1]
    : null;
  const probColor =
    (patient.latestRiskLevel === "High" && "text-red-500") ||
    (patient.latestRiskLevel === "Medium" && "text-yellow-500") ||
    "text-green-500";

  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Patient Info</h2>
            <p className="text-white font-medium text-xl">{patient.name}</p>
            <p className="text-slate-400 text-sm mt-1">{patient.patientId}</p>
            <p className="text-slate-300 mt-2">Age: {patient.age} · {patient.gender}</p>
            <p className="text-slate-300">Disease: {patient.disease}</p>
            {patient.phone && <p className="text-slate-300">Phone: {patient.phone}</p>}
            <div className="mt-4">
              <span className="inline-block bg-slate-700 text-slate-300 rounded-lg px-3 py-1 text-sm">
                {patient.currentHospital}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-sm mb-1">Treatment Stage</p>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 ${s <= (patient.treatmentStage || 1) ? "bg-cyan-500" : "bg-slate-600"}`}
                  />
                ))}
              </div>
              <p className="text-slate-400 text-xs mt-1">Stage {patient.treatmentStage ?? 1} of 4</p>
            </div>
            <button
              type="button"
              onClick={handleAssess}
              disabled={assessing}
              className="mt-4 w-full rounded-xl bg-cyan-500 text-white py-2 font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50"
            >
              {assessing ? "Assessing..." : "Re-Assess Risk"}
            </button>
          </div>
        </div>

        {/* Center column */}
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">AI Risk Assessment</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-4xl font-bold ${probColor}`}>
                {patient.latestRiskProbability ?? 0}%
              </span>
              <RiskBadge level={patient.latestRiskLevel || "Unknown"} showIcon size="lg" />
            </div>
            {lastAssessment?.primaryReasons?.length > 0 && (
              <ul className="space-y-2 mb-4">
                {lastAssessment.primaryReasons.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300">
                    <X className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
            {lastAssessment?.recommendation && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 text-cyan-400 text-sm mb-4">
                {lastAssessment.recommendation}
              </div>
            )}
            {lastAssessment?.assessedAt && (
              <p className="text-slate-500 text-xs">
                Last assessed: {new Date(lastAssessment.assessedAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Appointment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(patient.appointments || [])
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((a, i) => (
                      <tr key={i} className="border-b border-slate-700/50">
                        <td className="py-2 text-slate-300">
                          {a.date ? new Date(a.date).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-2 text-slate-300">{a.type || "—"}</td>
                        <td className="py-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              a.status === "completed"
                                ? "bg-green-500/20 text-green-500"
                                : a.status === "missed"
                                ? "bg-red-500/20 text-red-500"
                                : "bg-slate-600 text-slate-300"
                            }`}
                          >
                            {a.status || "scheduled"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={handleAddAppointment} className="mt-4 flex flex-wrap gap-2 items-end">
              <input
                type="datetime-local"
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm((f) => ({ ...f, date: e.target.value }))}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Type"
                value={appointmentForm.type}
                onChange={(e) => setAppointmentForm((f) => ({ ...f, type: e.target.value }))}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl px-3 py-2 text-sm w-24"
              />
              <select
                value={appointmentForm.status}
                onChange={(e) => setAppointmentForm((f) => ({ ...f, status: e.target.value }))}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl px-3 py-2 text-sm"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
              <input
                type="text"
                placeholder="Notes"
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm((f) => ({ ...f, notes: e.target.value }))}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl px-3 py-2 text-sm w-32"
              />
              <button
                type="submit"
                className="rounded-xl bg-cyan-500 text-white px-4 py-2 text-sm hover:bg-cyan-600 transition-colors"
              >
                Add Appointment
              </button>
            </form>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Recommended Schemes</h2>
            {schemes.length === 0 ? (
              <p className="text-slate-400 text-sm">No schemes recommended or loading...</p>
            ) : (
              <ul className="space-y-3">
                {schemes.map((s, i) => (
                  <li key={i} className="border border-slate-700 rounded-xl p-3">
                    <p className="text-white font-medium">{s.name}</p>
                    <p className="text-slate-400 text-sm mt-1">{s.benefit}</p>
                    <p className="text-slate-500 text-xs mt-1">Eligibility: {s.eligibility}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {s.enrolled ? (
                        <span className="flex items-center gap-1 text-green-500 text-sm">
                          <CheckCircle className="w-4 h-4" /> Enrolled
                        </span>
                      ) : (
                        <>
                          <a
                            href={s.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 text-sm hover:underline"
                          >
                            Apply
                          </a>
                          <button
                            type="button"
                            onClick={() => handleEnroll(s.name)}
                            className="rounded-lg bg-cyan-500/20 text-cyan-400 px-2 py-1 text-sm hover:bg-cyan-500/30"
                          >
                            Enroll
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Hospital Transfer History</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transferHistory.length === 0 ? (
                <p className="text-slate-400 text-sm">No transfer history.</p>
              ) : (
                transferHistory.map((t, i) => (
                  <div key={i} className="border-l-2 border-cyan-500/50 pl-3 py-1">
                    <p className="text-white text-sm font-medium">{t.hospital}</p>
                    <p className="text-slate-400 text-xs">{t.diagnosis}</p>
                    <p className="text-slate-500 text-xs">
                      {t.date ? new Date(t.date).toLocaleDateString() : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => setTransferModal(true)}
              className="mt-4 w-full rounded-xl bg-slate-700 text-white py-2 text-sm hover:bg-slate-600 transition-colors"
            >
              Transfer to New Hospital
            </button>
          </div>
        </div>
      </div>

      {transferModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Transfer to New Hospital</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">New Hospital *</label>
                <input
                  type="text"
                  value={transferForm.newHospital}
                  onChange={(e) => setTransferForm((f) => ({ ...f, newHospital: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Transfer Reason</label>
                <textarea
                  value={transferForm.transferReason}
                  onChange={(e) => setTransferForm((f) => ({ ...f, transferReason: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Receiving Doctor</label>
                <input
                  type="text"
                  value={transferForm.receivingDoctor}
                  onChange={(e) => setTransferForm((f) => ({ ...f, receivingDoctor: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyan-500 text-white py-2 hover:bg-cyan-600 transition-colors"
                >
                  Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setTransferModal(false)}
                  className="rounded-xl bg-slate-700 text-white py-2 px-4 hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
