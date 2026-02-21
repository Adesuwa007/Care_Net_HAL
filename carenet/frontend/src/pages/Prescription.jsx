import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, FileText, Download, Trash2 } from "lucide-react";
import { getPatient } from "../api/axios";
import { generatePrescriptionPDF } from "../utils/generatePDF";

const emptyMed = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

export default function Prescription() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        doctorName: "",
        doctorReg: "",
        hospitalName: "",
        date: new Date().toISOString().slice(0, 10),
        diagnosis: "",
        medications: [{ ...emptyMed }],
        notes: "",
        followUpDate: "",
    });

    useEffect(() => {
        if (!patientId) return;
        getPatient(patientId)
            .then((p) => {
                setPatient(p);
                setForm((prev) => ({
                    ...prev,
                    hospitalName: p.currentHospital || "",
                    diagnosis: p.disease || "",
                }));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [patientId]);

    const updateMed = (index, field, value) => {
        setForm((prev) => {
            const meds = [...prev.medications];
            meds[index] = { ...meds[index], [field]: value };
            return { ...prev, medications: meds };
        });
    };

    const addMed = () => {
        setForm((prev) => ({
            ...prev,
            medications: [...prev.medications, { ...emptyMed }],
        }));
    };

    const removeMed = (index) => {
        if (form.medications.length <= 1) return;
        setForm((prev) => ({
            ...prev,
            medications: prev.medications.filter((_, i) => i !== index),
        }));
    };

    const handleDownload = () => {
        if (!form.doctorName.trim()) {
            alert("Please enter the doctor name.");
            return;
        }
        if (!form.medications.some((m) => m.name.trim())) {
            alert("Please add at least one medication.");
            return;
        }
        generatePrescriptionPDF(patient, form);
    };

    const clearForm = () => {
        setForm({
            doctorName: "",
            doctorReg: "",
            hospitalName: patient?.currentHospital || "",
            date: new Date().toISOString().slice(0, 10),
            diagnosis: patient?.disease || "",
            medications: [{ ...emptyMed }],
            notes: "",
            followUpDate: "",
        });
    };

    if (loading) {
        return (
            <div className="p-8 animate-fadeIn">
                <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-3 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-slate-800 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                    <div className="col-span-2">
                        <div className="h-[600px] bg-slate-800 animate-pulse rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="p-8">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
                    {error || "Patient not found."}
                </div>
            </div>
        );
    }

    const inputCls = "w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5 text-sm";

    return (
        <div className="p-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 animate-fadeInUp">
                <button
                    onClick={() => navigate(`/patients/${patientId}`)}
                    className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create Prescription</h1>
                    <p className="text-slate-400 text-sm">
                        For {patient.name} ({patient.patientId})
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-6">
                {/* Left: Form */}
                <div className="col-span-3 space-y-4 animate-fadeInUp">
                    {/* Doctor Info */}
                    <div className="glass-card p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            Doctor Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                                    Doctor Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.doctorName}
                                    onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))}
                                    className={inputCls}
                                    placeholder="Dr. Name"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                                    Registration Number
                                </label>
                                <input
                                    type="text"
                                    value={form.doctorReg}
                                    onChange={(e) => setForm((f) => ({ ...f, doctorReg: e.target.value }))}
                                    className={inputCls}
                                    placeholder="MCI/12345"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                                    Hospital / Clinic
                                </label>
                                <input
                                    type="text"
                                    value={form.hospitalName}
                                    onChange={(e) => setForm((f) => ({ ...f, hospitalName: e.target.value }))}
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs font-medium mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                    className={inputCls}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="glass-card p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            Diagnosis
                        </h3>
                        <textarea
                            value={form.diagnosis}
                            onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))}
                            rows={2}
                            className={inputCls}
                            placeholder="Primary diagnosis"
                        />
                    </div>

                    {/* Medications */}
                    <div className="glass-card p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                Medications
                            </h3>
                            <button
                                type="button"
                                onClick={addMed}
                                className="text-cyan-400 text-xs font-medium flex items-center gap-1 border border-cyan-500/30 rounded-lg px-3 py-1.5 hover:bg-cyan-500/10 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Medicine
                            </button>
                        </div>
                        {form.medications.map((med, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <div className="flex-1 grid grid-cols-5 gap-2">
                                    <input
                                        type="text"
                                        value={med.name}
                                        onChange={(e) => updateMed(i, "name", e.target.value)}
                                        className={`${inputCls} col-span-2`}
                                        placeholder="Medicine Name"
                                    />
                                    <input
                                        type="text"
                                        value={med.dosage}
                                        onChange={(e) => updateMed(i, "dosage", e.target.value)}
                                        className={inputCls}
                                        placeholder="500mg"
                                    />
                                    <input
                                        type="text"
                                        value={med.frequency}
                                        onChange={(e) => updateMed(i, "frequency", e.target.value)}
                                        className={inputCls}
                                        placeholder="Twice daily"
                                    />
                                    <input
                                        type="text"
                                        value={med.duration}
                                        onChange={(e) => updateMed(i, "duration", e.target.value)}
                                        className={inputCls}
                                        placeholder="7 days"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={med.instructions}
                                    onChange={(e) => updateMed(i, "instructions", e.target.value)}
                                    className={`${inputCls} w-32`}
                                    placeholder="After food"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeMed(i)}
                                    disabled={form.medications.length <= 1}
                                    className="mt-2 text-red-400 hover:text-red-300 disabled:opacity-20 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Notes & Follow-up */}
                    <div className="glass-card p-5 space-y-4">
                        <div>
                            <label className="block text-slate-400 text-xs font-medium mb-1.5">
                                Additional Notes / Instructions
                            </label>
                            <textarea
                                value={form.notes}
                                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                rows={3}
                                className={inputCls}
                                placeholder="Optional notes..."
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs font-medium mb-1.5">
                                Follow-up Date
                            </label>
                            <input
                                type="date"
                                value={form.followUpDate}
                                onChange={(e) => setForm((f) => ({ ...f, followUpDate: e.target.value }))}
                                className={`${inputCls} max-w-xs`}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="btn-premium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 font-bold flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Generate & Download Prescription PDF
                        </button>
                        <button
                            type="button"
                            onClick={clearForm}
                            className="rounded-xl bg-slate-700/50 text-white px-4 py-3 hover:bg-slate-600/50 transition-colors font-medium flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Form
                        </button>
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div className="col-span-2 animate-fadeInUp">
                    <p className="text-slate-400 text-sm font-medium mb-3">Preview</p>
                    <div className="bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden sticky top-8">
                        {/* Cyan header */}
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-lg">CARE-NET</p>
                                    <p className="text-white/80 text-xs">Digital Prescription</p>
                                </div>
                                <p className="text-white/70 text-xs">
                                    RX-{Math.random().toString().slice(2, 8)}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 text-sm space-y-4">
                            {/* Doctor & Hospital */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">
                                        Prescribing Doctor
                                    </p>
                                    <p className="text-gray-800 font-bold">
                                        {form.doctorName || "—"}
                                    </p>
                                    {form.doctorReg && (
                                        <p className="text-gray-400 text-xs">Reg: {form.doctorReg}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">
                                        Healthcare Facility
                                    </p>
                                    <p className="text-gray-800 font-bold">
                                        {form.hospitalName || "—"}
                                    </p>
                                    <p className="text-gray-400 text-xs">Date: {form.date}</p>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Patient Info */}
                            <div>
                                <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-1">
                                    Patient Information
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <p>
                                        <span className="text-gray-400">Name:</span>{" "}
                                        <span className="font-medium">{patient.name}</span>
                                    </p>
                                    <p>
                                        <span className="text-gray-400">ID:</span>{" "}
                                        <span className="font-medium">{patient.patientId}</span>
                                    </p>
                                    <p>
                                        <span className="text-gray-400">Age/Gender:</span>{" "}
                                        <span className="font-medium">
                                            {patient.age} / {patient.gender}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-gray-400">Disease:</span>{" "}
                                        <span className="font-medium">{patient.disease}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Diagnosis */}
                            {form.diagnosis && (
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-1">
                                        Diagnosis
                                    </p>
                                    <p className="text-gray-700 text-xs bg-gray-50 rounded-lg p-2">
                                        {form.diagnosis}
                                    </p>
                                </div>
                            )}

                            {/* Medications */}
                            {form.medications.some((m) => m.name.trim()) && (
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-1">
                                        Prescribed Medications
                                    </p>
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-gray-400">
                                                <th className="text-left py-1 font-medium">#</th>
                                                <th className="text-left py-1 font-medium">Medicine</th>
                                                <th className="text-left py-1 font-medium">Dosage</th>
                                                <th className="text-left py-1 font-medium">Frequency</th>
                                                <th className="text-left py-1 font-medium">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {form.medications
                                                .filter((m) => m.name.trim())
                                                .map((m, i) => (
                                                    <tr key={i} className="border-b border-gray-100">
                                                        <td className="py-1 text-cyan-600 font-medium">{i + 1}</td>
                                                        <td className="py-1 font-medium">{m.name}</td>
                                                        <td className="py-1 text-gray-500">{m.dosage || "—"}</td>
                                                        <td className="py-1 text-gray-500">{m.frequency || "—"}</td>
                                                        <td className="py-1 text-gray-500">{m.duration || "—"}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Notes */}
                            {form.notes && (
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-1">
                                        Doctor's Notes
                                    </p>
                                    <p className="text-gray-700 text-xs bg-gray-50 rounded-lg p-2">
                                        {form.notes}
                                    </p>
                                </div>
                            )}

                            {/* Follow-up */}
                            {form.followUpDate && (
                                <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-2 text-xs text-center">
                                    <p className="text-cyan-700 font-medium">
                                        Follow-up Date: {form.followUpDate}
                                    </p>
                                    <p className="text-cyan-500 text-[10px]">
                                        Please bring this prescription on your next visit
                                    </p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="border-t border-gray-200 pt-3 text-center">
                                <p className="text-gray-300 text-[9px]">
                                    Generated by CARE-NET — HAL 4.0 Hackathon
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
