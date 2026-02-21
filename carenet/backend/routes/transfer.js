const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const { runAssessmentAndSave } = require("../utils/assessRisk");
const { createLog } = require("../middleware/logger");


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
    await createLog({
      type: "RECORD_TRANSFERRED",
      username: req.user?.username || "system",
      role: req.user?.role || "",
      description: `Records transferred for ${updated.name} from ${prevHospital} to ${newHospital}`,
      patientId: updated.patientId,
      patientName: updated.name,
      status: "SUCCESS"
    });
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
