const { predictRisk } = require("../mlClient");

function countMissedAppointments(appointments) {
  if (!Array.isArray(appointments)) return 0;
  return appointments.filter((a) => a.status === "missed").length;
}

/**
 * Run ML risk assessment on a patient document and persist the result.
 * Returns the saved patient document.
 */
async function runAssessmentAndSave(patient) {
  const assessmentPayload = {
    missed_appointments: countMissedAppointments(patient.appointments),
    days_since_last_visit: patient.daysSinceLastVisit ?? 0,
    financial_score: patient.financialScore ?? 5,
    treatment_stage: patient.treatmentStage ?? 1,
    follow_up_calls_received: patient.followUpCallsReceived ?? 0,
    hospital_delay_days: patient.hospitalDelayDays ?? 0,
    scheme_enrolled: patient.schemeEnrolled ? 1 : 0,
  };

  const result = await predictRisk({
    ...(patient.toObject?.() ?? patient),
    missedAppointments: assessmentPayload.missed_appointments,
    daysSinceLastVisit: assessmentPayload.days_since_last_visit,
    financialScore: assessmentPayload.financial_score,
    treatmentStage: assessmentPayload.treatment_stage,
    followUpCallsReceived: assessmentPayload.follow_up_calls_received,
    hospitalDelayDays: assessmentPayload.hospital_delay_days,
    schemeEnrolled: assessmentPayload.scheme_enrolled === 1,
  });

  const riskEntry = {
    assessedAt: new Date(),
    riskLevel: result.risk_level,
    riskProbability: result.risk_probability,
    primaryReasons: result.primary_reasons || [],
    recommendation: result.recommendation || "",
  };

  patient.riskAssessments = patient.riskAssessments || [];
  patient.riskAssessments.push(riskEntry);
  patient.latestRiskLevel = result.risk_level;
  patient.latestRiskProbability = result.risk_probability;
  await patient.save();
  return patient;
}

module.exports = { runAssessmentAndSave, countMissedAppointments };
