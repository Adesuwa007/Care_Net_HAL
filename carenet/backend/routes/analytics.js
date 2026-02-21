const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

router.get("/api/analytics/overview", async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: { $ne: false } });
    const totalPatients = patients.length;
    const highRiskCount = patients.filter((p) => p.latestRiskLevel === "High").length;
    const mediumRiskCount = patients.filter((p) => p.latestRiskLevel === "Medium").length;
    const lowRiskCount = patients.filter((p) => p.latestRiskLevel === "Low").length;
    const unknownCount = patients.filter(
      (p) => !p.latestRiskLevel || p.latestRiskLevel === "Unknown"
    ).length;
    const dropoutRiskRate =
      totalPatients > 0 ? (highRiskCount / totalPatients) * 100 : 0;
    const schemeEnrollmentRate =
      totalPatients > 0
        ? (patients.filter((p) => p.schemeEnrolled).length / totalPatients) * 100
        : 0;
    const diseaseMap = {};
    patients.forEach((p) => {
      if (!diseaseMap[p.disease]) diseaseMap[p.disease] = { count: 0, highRiskCount: 0 };
      diseaseMap[p.disease].count += 1;
      if (p.latestRiskLevel === "High") diseaseMap[p.disease].highRiskCount += 1;
    });
    const diseaseBreakdown = Object.entries(diseaseMap).map(([disease, v]) => ({
      disease,
      count: v.count,
      highRiskCount: v.highRiskCount,
    }));
    const hospitalMap = {};
    patients.forEach((p) => {
      const h = p.currentHospital || "Unknown";
      if (!hospitalMap[h]) hospitalMap[h] = { count: 0, highRiskCount: 0 };
      hospitalMap[h].count += 1;
      if (p.latestRiskLevel === "High") hospitalMap[h].highRiskCount += 1;
    });
    const hospitalBreakdown = Object.entries(hospitalMap).map(([hospital, v]) => ({
      hospital,
      count: v.count,
      highRiskCount: v.highRiskCount,
    }));
    const highRiskPatients = patients
      .filter((p) => p.latestRiskLevel === "High")
      .sort((a, b) => (b.latestRiskProbability || 0) - (a.latestRiskProbability || 0))
      .slice(0, 5)
      .map((p) => ({
        _id: p._id,
        name: p.name,
        disease: p.disease,
        currentHospital: p.currentHospital,
        latestRiskLevel: p.latestRiskLevel,
        latestRiskProbability: p.latestRiskProbability,
      }));
    res.json({
      totalPatients,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount: lowRiskCount + unknownCount,
      dropoutRiskRate: Math.round(dropoutRiskRate * 10) / 10,
      schemeEnrollmentRate: Math.round(schemeEnrollmentRate * 10) / 10,
      diseaseBreakdown,
      hospitalBreakdown,
      recentHighRiskPatients: highRiskPatients,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/analytics/trends", async (req, res) => {
  const trends = [
    { week: "Week 1", highRisk: 12, mediumRisk: 28, lowRisk: 60 },
    { week: "Week 2", highRisk: 14, mediumRisk: 26, lowRisk: 60 },
    { week: "Week 3", highRisk: 11, mediumRisk: 30, lowRisk: 59 },
    { week: "Week 4", highRisk: 13, mediumRisk: 29, lowRisk: 58 },
    { week: "Week 5", highRisk: 15, mediumRisk: 27, lowRisk: 58 },
    { week: "Week 6", highRisk: 10, mediumRisk: 32, lowRisk: 58 },
    { week: "Week 7", highRisk: 9, mediumRisk: 31, lowRisk: 60 },
  ];
  res.json(trends);
});

router.get("/api/analytics/stage-breakdown", async (req, res) => {
  try {
    const stages = await Patient.aggregate([
      { $match: { isActive: { $ne: false } } },
      { $group: { _id: "$treatmentStage", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const labels = {
      1: "Stage 1 - Early",
      2: "Stage 2 - Progressing",
      3: "Stage 3 - Advanced",
      4: "Stage 4 - Final",
    };
    const result = [1, 2, 3, 4].map((s) => {
      const found = stages.find((st) => st._id === s);
      return { stage: s, label: labels[s], count: found ? found.count : 0 };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
