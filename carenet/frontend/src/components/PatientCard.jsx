import { useNavigate } from "react-router-dom";
import RiskBadge from "./RiskBadge";

export default function PatientCard({ patient }) {
  const navigate = useNavigate();
  const level = patient.latestRiskLevel || "Unknown";
  return (
    <div
      className="bg-slate-800 border border-slate-700 rounded-2xl p-4 hover:border-slate-600 transition-colors cursor-pointer"
      onClick={() => navigate(`/patients/${patient._id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/patients/${patient._id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white font-semibold">{patient.name}</p>
          <p className="text-slate-400 text-sm">{patient.patientId}</p>
          <p className="text-slate-400 text-sm mt-1">{patient.disease} · {patient.currentHospital}</p>
        </div>
        <RiskBadge level={level} showIcon size="sm" />
      </div>
      <button
        type="button"
        className="mt-3 w-full py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm font-medium"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/patients/${patient._id}`);
        }}
      >
        View Profile
      </button>
    </div>
  );
}
