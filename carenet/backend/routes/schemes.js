const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const { predictRisk } = require("../mlClient");

const SCHEMES = {
  "Ayushman Bharat PM-JAY": {
    name: "Ayushman Bharat PM-JAY",
    benefit: "Health cover of ₹5 lakh per family per year for secondary and tertiary care.",
    eligibility: "Families in bottom 40% as per SECC; no age or size cap.",
    applicationLink: "https://www.pmjay.gov.in/",
    urgent: false,
  },
  "Nikshay Poshan Yojana (₹500/month)": {
    name: "Nikshay Poshan Yojana (₹500/month)",
    benefit: "₹500 per month nutritional support for TB patients during treatment.",
    eligibility: "All notified TB patients.",
    applicationLink: "https://tbcindia.gov.in/",
    urgent: false,
  },
  "Rashtriya Vayoshri Yojana": {
    name: "Rashtriya Vayoshri Yojana",
    benefit: "Assisted living devices for senior citizens (hearing aids, wheelchairs, etc.).",
    eligibility: "Senior citizens from BPL families, 60+ years.",
    applicationLink: "https://www.elderly.gov.in/",
    urgent: false,
  },
  "Janani Suraksha Yojana": {
    name: "Janani Suraksha Yojana",
    benefit: "Cash assistance for institutional delivery and maternal care.",
    eligibility: "Pregnant women from BPL/SC/ST families.",
    applicationLink: "https://nhm.gov.in/index1.php?lang=1&level=1&sublinkid=819&lid=221",
    urgent: false,
  },
  "CGHS scheme": {
    name: "CGHS scheme",
    benefit: "Central government health scheme for comprehensive medical care.",
    eligibility: "Central govt employees/pensioners; certain conditions for others.",
    applicationLink: "https://cghs.gov.in/",
    urgent: false,
  },
  "State health card": {
    name: "State health card",
    benefit: "State-specific health insurance and subsidized care.",
    eligibility: "Varies by state; typically low-income families.",
    applicationLink: "https://www.india.gov.in/",
    urgent: false,
  },
};

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

router.get("/api/schemes/recommend/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.patientId,
      isActive: { $ne: false },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const list = [];
    const isHighRisk = patient.latestRiskLevel === "High";
    if (patient.financialScore < 4) {
      list.push({ ...SCHEMES["Ayushman Bharat PM-JAY"], urgent: isHighRisk });
    }
    if (patient.disease === "TB") {
      list.push({ ...SCHEMES["Nikshay Poshan Yojana (₹500/month)"], urgent: isHighRisk });
    }
    if (patient.age > 60) {
      list.push({ ...SCHEMES["Rashtriya Vayoshri Yojana"], urgent: isHighRisk });
    }
    if (patient.disease === "Maternal Care") {
      list.push({ ...SCHEMES["Janani Suraksha Yojana"], urgent: isHighRisk });
    }
    if (patient.financialScore < 6 && patient.disease === "Diabetes") {
      list.push({ ...SCHEMES["CGHS scheme"], urgent: isHighRisk });
    }
    if (patient.financialScore < 6) {
      list.push({ ...SCHEMES["State health card"], urgent: isHighRisk });
    }
    const enrolled = new Set(patient.enrolledSchemes || []);
    const recommendations = list.map((s) => ({
      ...s,
      enrolled: enrolled.has(s.name),
    }));
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/schemes/enroll/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.patientId,
      isActive: { $ne: false },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const { schemeName } = req.body;
    if (!schemeName) return res.status(400).json({ error: "schemeName required" });
    patient.schemeEnrolled = true;
    patient.enrolledSchemes = patient.enrolledSchemes || [];
    if (!patient.enrolledSchemes.includes(schemeName)) {
      patient.enrolledSchemes.push(schemeName);
    }
    await patient.save();
    await runAssessmentAndSave(patient);
    const updated = await Patient.findById(patient._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
