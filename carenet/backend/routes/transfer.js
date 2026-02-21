const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const { predictRisk } = require("../mlClient");

function countMissedAppointments(appointments) {
  if (!Array.isArray(appointments)) return 0;
  return appointments.filter((a) => a.status === "missed").length;
}

async function runAssessmentAndSave(patient) {
  const payload = {
    missed_appointments: countMissedAppointments(patient.appointments),
    days_since_last_visit: patient.daysSinceLastVisit ?? 0,
    financial_score: patient.financialScore ?? 5,
    treatment_stage: patient.treatmentStage ?? 1,
    follow_up_calls_received: patient.followUpCallsReceived ?? 0,
    hospital_delay_days: patient.hospitalDelayDays ?? 0,
    scheme_enrolled: patient.schemeEnrolled ? 1 : 0,
  };
  const result = await predictRisk({
    ...patient.toObject?.(),
    missedAppointments: payload.missed_appointments,
    daysSinceLastVisit: payload.days_since_last_visit,
    financialScore: payload.financial_score,
    treatmentStage: payload.treatment_stage,
    followUpCallsReceived: payload.follow_up_calls_received,
    hospitalDelayDays: payload.hospital_delay_days,
    schemeEnrolled: payload.scheme_enrolled === 1,
  });
  patient.riskAssessments = patient.riskAssessments || [];
  patient.riskAssessments.push({
    assessedAt: new Date(),
    riskLevel: result.risk_level,
    riskProbability: result.risk_probability,
    primaryReasons: result.primary_reasons || [],
    recommendation: result.recommendation || "",
  });
  patient.latestRiskLevel = result.risk_level;
  patient.latestRiskProbability = result.risk_probability;
  await patient.save();
  return patient;
}

router.post("/api/transfer/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.patientId,
      isActive: { $ne: false },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const { newHospital, transferReason, receivingDoctor } = req.body;
    if (!newHospital) return res.status(400).json({ error: "newHospital required" });
    const prevHospital = patient.currentHospital;
    const summary =
      (patient.medicalHistory || [])
        .concat([])
        .reverse()
        .slice(0, 5)
        .map(
          (e) =>
            `${e.hospital || ""} | ${e.diagnosis || ""} | ${e.date ? new Date(e.date).toISOString().slice(0, 10) : ""}`
        )
        .join("; ") || "No prior history";
    patient.medicalHistory = patient.medicalHistory || [];
    patient.medicalHistory.push({
      hospital: prevHospital,
      diagnosis: patient.disease,
      treatment: "Transfer out",
      doctor: receivingDoctor || "",
      date: new Date(),
      notes: `Transfer to ${newHospital}. Reason: ${transferReason || "Not specified"}. Summary: ${summary}`,
    });
    patient.medicalHistory.push({
      hospital: newHospital,
      diagnosis: patient.disease,
      treatment: "Transfer in",
      doctor: receivingDoctor || "",
      date: new Date(),
      notes: `Transferred from ${prevHospital}. Reason: ${transferReason || "Not specified"}`,
    });
    patient.currentHospital = newHospital;
    await patient.save();
    await runAssessmentAndSave(patient);
    const updated = await Patient.findById(patient._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/transfer/:patientId/history", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.patientId,
      isActive: { $ne: false },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const history = (patient.medicalHistory || [])
      .filter((e) => e.hospital)
      .map((e) => ({
        hospital: e.hospital,
        diagnosis: e.diagnosis,
        date: e.date,
        notes: e.notes,
        doctor: e.doctor,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
