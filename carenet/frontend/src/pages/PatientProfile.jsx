import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, CheckCircle, ArrowLeft, Brain, Calendar, Building2, FileText, Shield, FileEdit } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { getPatient, assessPatient, getSchemes, enrollScheme, addAppointment, getTransferHistory, transferPatient } from "../api/axios";
import { generatePatientPDF } from "../utils/generatePDF";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      getTransferHistory(id).then(setTransferHistory).catch(() => { });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 animate-fadeIn">
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-8 animate-fadeInUp">
        <div className="glass-card p-6 border-red-500/30 text-red-400">
          {error || "Patient not found."}
        </div>
      </div>
    );
  }

  const lastAssessment = patient.riskAssessments?.length
    ? patient.riskAssessments[patient.riskAssessments.length - 1]
    : null;
  const probColor =
    (patient.latestRiskLevel === "High" && "text-red-400") ||
    (patient.latestRiskLevel === "Medium" && "text-yellow-400") ||
    "text-green-400";

  return (
    <div className="p-8 animate-fadeIn">
      {/* Back button + header */}
      <div className="flex items-center gap-4 mb-6 animate-fadeInUp">
        <button
          onClick={() => navigate("/patients")}
          className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">{patient.name}</h1>
          <p className="text-cyan-400/80 text-sm font-mono">{patient.patientId}</p>
        </div>
        <div className="ml-auto">
          <RiskBadge level={patient.latestRiskLevel || "Unknown"} showIcon size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div className="glass-card p-5 animate-fadeInUp delay-100">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Patient Info</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Age</span>
                <span className="text-white font-medium">{patient.age}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Gender</span>
                <span className="text-white font-medium">{patient.gender}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Disease</span>
                <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded-lg">{patient.disease}</span>
              </div>
              {patient.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Phone</span>
                  <span className="text-white font-medium">{patient.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Hospital</span>
                <span className="text-slate-300 text-sm text-right max-w-[60%] truncate">{patient.currentHospital}</span>
              </div>
            </div>

            {/* Treatment Stage */}
            <div className="mt-5 pt-4 border-t border-slate-700/30">
              <p className="text-slate-500 text-xs font-medium mb-2">Treatment Progress</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full transition-all duration-500 ${s <= (patient.treatmentStage || 1)
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : "bg-slate-700/50"
                      }`}
                  />
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-1.5">Stage {patient.treatmentStage ?? 1} of 4</p>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={handleAssess}
                disabled={assessing}
                className="btn-premium w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4" />
                {assessing ? "Assessing..." : "Re-Assess Risk"}
              </button>
              <button
                type="button"
                onClick={() => generatePatientPDF(patient)}
                className="w-full flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-slate-700/50"
              >
                <FileText className="w-4 h-4" />
                Download Record
              </button>
              <button
                type="button"
                onClick={() => navigate(`/prescription/${patient.patientId || patient._id}`)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-purple-400 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-purple-500/20"
              >
                <FileEdit className="w-4 h-4" />
                Create Prescription
              </button>
            </div>
          </div>
        </div>

        {/* Center column */}
        <div className="space-y-4">
          {/* AI Risk Assessment */}
          <div className="glass-card p-5 animate-fadeInUp delay-200">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">AI Risk Assessment</h2>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <span className={`text-5xl font-extrabold ${probColor}`}>
                {patient.latestRiskProbability ?? 0}%
              </span>
              <div>
                <RiskBadge level={patient.latestRiskLevel || "Unknown"} showIcon size="md" />
                <p className="text-slate-500 text-xs mt-1">Dropout probability</p>
              </div>
            </div>
            {lastAssessment?.primaryReasons?.length > 0 && (
              <ul className="space-y-2 mb-4">
                {lastAssessment.primaryReasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
            {lastAssessment?.recommendation && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-cyan-400 text-sm">
                {lastAssessment.recommendation}
              </div>
            )}
            {lastAssessment?.assessedAt && (
              <p className="text-slate-600 text-xs mt-3">
                Last assessed: {new Date(lastAssessment.assessedAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* Appointment History */}
          <div className="glass-card p-5 animate-fadeInUp delay-300">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Appointments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700/30">
                    <th className="text-left py-2 font-semibold">Date</th>
                    <th className="text-left py-2 font-semibold">Type</th>
                    <th className="text-left py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(patient.appointments || [])
                    .slice()
                    .reverse()
                    .slice(0, 8)
                    .map((a, i) => (
                      <tr key={i} className="border-b border-slate-700/20">
                        <td className="py-2.5 text-slate-300">
                          {a.date ? new Date(a.date).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-2.5 text-slate-300">{a.type || "—"}</td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.status === "completed"
                              ? "bg-green-500/15 text-green-400"
                              : a.status === "missed"
                                ? "bg-red-500/15 text-red-400"
                                : "bg-slate-600/50 text-slate-300"
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
                className="bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Type"
                value={appointmentForm.type}
                onChange={(e) => setAppointmentForm((f) => ({ ...f, type: e.target.value }))}
                className="bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-3 py-2 text-sm w-24"
              />
              <select
                value={appointmentForm.status}
                onChange={(e) => setAppointmentForm((f) => ({ ...f, status: e.target.value }))}
                className="bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-3 py-2 text-sm"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
              <button
                type="submit"
                className="btn-premium rounded-xl bg-cyan-500/20 text-cyan-400 px-4 py-2 text-sm font-medium hover:bg-cyan-500/30 transition-colors"
              >
                + Add
              </button>
            </form>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Schemes */}
          <div className="glass-card p-5 animate-fadeInUp delay-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recommended Schemes</h2>
            </div>
            {schemes.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">No schemes recommended</p>
            ) : (
              <ul className="space-y-3">
                {schemes.map((s, i) => (
                  <li key={i} className="border border-slate-700/30 rounded-xl p-3 hover:bg-slate-800/30 transition-colors">
                    <p className="text-white font-medium text-sm">{s.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{s.benefit}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {s.enrolled ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Enrolled
                        </span>
                      ) : (
                        <>
                          <a
                            href={s.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 text-xs hover:underline"
                          >
                            Apply →
                          </a>
                          <button
                            type="button"
                            onClick={() => handleEnroll(s.name)}
                            className="rounded-lg bg-cyan-500/15 text-cyan-400 px-2 py-1 text-xs font-medium hover:bg-cyan-500/25 transition-colors"
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

          {/* Aadhaar Card */}
          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/20 rounded-2xl p-5 animate-fadeInUp delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <p className="text-orange-400 font-bold text-sm">Aadhaar-Linked Identity</p>
                  <p className="text-slate-500 text-xs">Government of India</p>
                </div>
              </div>
              {patient.aadhaarVerified && (
                <span className="bg-green-500/15 text-green-400 text-xs px-2 py-1 rounded-full font-semibold">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-slate-500 text-xs">Full Name</p>
                <p className="text-white font-bold">{patient.name}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">CARE-NET ID</p>
                <p className="text-cyan-400 font-mono font-bold tracking-wider">{patient.patientId}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Aadhaar Number</p>
                <p className="text-white font-mono tracking-widest text-lg">
                  XXXX - XXXX -&nbsp;
                  <span className="text-orange-400 font-bold">{patient.aadhaarLast4 || "----"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Transfer History */}
          <div className="glass-card p-5 animate-fadeInUp delay-400">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Transfer History</h2>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {transferHistory.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No transfer history</p>
              ) : (
                transferHistory.map((t, i) => (
                  <div key={i} className="border-l-2 border-cyan-500/40 pl-3 py-1.5">
                    <p className="text-white text-sm font-medium">{t.hospital}</p>
                    <p className="text-slate-500 text-xs">{t.diagnosis}</p>
                    <p className="text-slate-600 text-xs">
                      {t.date ? new Date(t.date).toLocaleDateString() : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => setTransferModal(true)}
              className="mt-4 w-full rounded-xl bg-slate-800/50 border border-slate-700/50 text-white py-2.5 text-sm font-medium hover:bg-slate-700/50 transition-all"
            >
              Transfer to New Hospital
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card p-6 max-w-md w-full animate-scaleIn glow-cyan">
            <h3 className="text-lg font-bold text-white mb-5">Transfer to New Hospital</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1.5">New Hospital *</label>
                <input
                  type="text"
                  value={transferForm.newHospital}
                  onChange={(e) => setTransferForm((f) => ({ ...f, newHospital: e.target.value }))}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1.5">Transfer Reason</label>
                <textarea
                  value={transferForm.transferReason}
                  onChange={(e) => setTransferForm((f) => ({ ...f, transferReason: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1.5">Receiving Doctor</label>
                <input
                  type="text"
                  value={transferForm.receivingDoctor}
                  onChange={(e) => setTransferForm((f) => ({ ...f, receivingDoctor: e.target.value }))}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn-premium flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 font-medium"
                >
                  Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setTransferModal(false)}
                  className="rounded-xl bg-slate-700/50 text-white py-2.5 px-5 hover:bg-slate-600/50 transition-colors"
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
