const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const { runAssessmentAndSave } = require("../utils/assessRisk");

router.get("/api/patients", async (req, res) => {
  try {
    const { riskLevel, disease, hospital } = req.query;
    const filter = { isActive: { $ne: false } };
    if (riskLevel) filter.latestRiskLevel = riskLevel;
    if (disease) filter.disease = disease;
    if (hospital) filter.currentHospital = new RegExp(hospital, "i");
    const patients = await Patient.find(filter).sort({
      latestRiskProbability: -1,
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/patients/high-risk", async (req, res) => {
  try {
    const patients = await Patient.find({
      isActive: { $ne: false },
      latestRiskLevel: "High",
    }).sort({ latestRiskProbability: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/patients", async (req, res) => {
  try {
    const body = req.body;
    const missed = body.missedAppointments ?? 0;
    const patient = new Patient({
      name: body.name,
      age: body.age,
      gender: body.gender,
      phone: body.phone,
      disease: body.disease,
      treatmentStage: body.treatmentStage ?? 1,
      financialScore: body.financialScore ?? 5,
      schemeEnrolled: body.schemeEnrolled ?? false,
      enrolledSchemes: body.enrolledSchemes ?? [],
      currentHospital: body.currentHospital,
      followUpCallsReceived: body.followUpCallsReceived ?? 0,
      missedAppointments: missed,
      daysSinceLastVisit: body.daysSinceLastVisit ?? 0,
      hospitalDelayDays: body.hospitalDelayDays ?? 0,
      appointments: body.appointments ?? [],
      medicalHistory: body.medicalHistory ?? [],
      aadhaarLast4: body.aadhaarLast4 || null,
      aadhaarVerified: body.aadhaarVerified ?? false,
    });
    if (body.initialDiagnosis) {
      patient.medicalHistory = patient.medicalHistory || [];
      patient.medicalHistory.push({
        hospital: body.currentHospital,
        diagnosis: body.initialDiagnosis,
        treatment: "",
        doctor: "",
        date: new Date(),
        notes: "Initial registration",
      });
    }
    await patient.save();
    await runAssessmentAndSave(patient);
    const updated = await Patient.findById(patient._id);
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      isActive: { $ne: false },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      isActive: { $ne: false },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const allowed = [
      "name",
      "age",
      "gender",
      "phone",
      "disease",
      "treatmentStage",
      "financialScore",
      "schemeEnrolled",
      "enrolledSchemes",
      "currentHospital",
      "followUpCallsReceived",
      "missedAppointments",
      "daysSinceLastVisit",
      "hospitalDelayDays",
      "aadhaarLast4",
      "aadhaarVerified",
    ];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) patient[key] = req.body[key];
    });
    await patient.save();
    await runAssessmentAndSave(patient);
    const updated = await Patient.findById(patient._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/api/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    patient.isActive = false;
    await patient.save();
    res.json({ message: "Patient deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/patients/:id/assess", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      isActive: { $ne: false },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    await runAssessmentAndSave(patient);
    const updated = await Patient.findById(patient._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/patients/:id/appointment", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      isActive: { $ne: false },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const { date, type, status, notes } = req.body;
    patient.appointments = patient.appointments || [];
    patient.appointments.push({
      date: date ? new Date(date) : new Date(),
      type: type || "checkup",
      status: status || "scheduled",
      notes: notes || "",
    });
    await patient.save();
    const updated = await Patient.findById(patient._id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
