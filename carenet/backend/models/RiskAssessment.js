const mongoose = require("mongoose");

const riskAssessmentSchema = new mongoose.Schema({
  assessedAt: { type: Date, default: Date.now },
  riskLevel: String,
  riskProbability: Number,
  primaryReasons: [String],
  recommendation: String,
});

module.exports = riskAssessmentSchema;
