const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

async function predictRisk(patient) {
  const payload = {
    missed_appointments: patient.missedAppointments ?? countMissedAppointments(patient.appointments),
    days_since_last_visit: patient.daysSinceLastVisit ?? 0,
    financial_score: patient.financialScore ?? 5,
    treatment_stage: patient.treatmentStage ?? 1,
    follow_up_calls_received: patient.followUpCallsReceived ?? 0,
    hospital_delay_days: patient.hospitalDelayDays ?? 0,
    scheme_enrolled: patient.schemeEnrolled ? 1 : 0,
  };
  const { data } = await axios.post(`${ML_SERVICE_URL}/predict`, payload, {
    timeout: 10000,
  });
  return data;
}

function countMissedAppointments(appointments) {
  if (!Array.isArray(appointments)) return 0;
  return appointments.filter((a) => a.status === "missed").length;
}

module.exports = { predictRisk };
