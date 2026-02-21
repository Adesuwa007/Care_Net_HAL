import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import RiskBadge from "./RiskBadge";

export default function PatientCard({ patient }) {
  const navigate = useNavigate();
  const level = patient.latestRiskLevel || "Unknown";
  return (
    <div
      className="glass-card p-4 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
      onClick={() => navigate(`/patients/${patient._id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/patients/${patient._id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white font-semibold">{patient.name}</p>
          <p className="text-cyan-400/80 text-xs font-mono mt-0.5">{patient.patientId}</p>
          <p className="text-slate-400 text-sm mt-1.5">{patient.disease} · {patient.currentHospital}</p>
        </div>
        <RiskBadge level={level} showIcon size="sm" />
      </div>
      <button
        type="button"
        className="mt-4 w-full py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-cyan-500/15"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/patients/${patient._id}`);
        }}
      >
        View Profile
        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}
