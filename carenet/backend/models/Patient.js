const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
  hospital: String,
  diagnosis: String,
  treatment: String,
  doctor: String,
  date: Date,
  notes: String,
});

const appointmentSchema = new mongoose.Schema({
  date: Date,
  type: String,
  status: {
    type: String,
    enum: ["scheduled", "completed", "missed"],
  },
  notes: String,
});

const riskAssessmentSchema = new mongoose.Schema({
  assessedAt: Date,
  riskLevel: String,
  riskProbability: Number,
  primaryReasons: [String],
  recommendation: String,
});

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    phone: String,
    disease: { type: String, required: true },
    treatmentStage: { type: Number, default: 1, min: 1, max: 4 },
    financialScore: { type: Number, default: 5, min: 1, max: 10 },
    schemeEnrolled: { type: Boolean, default: false },
    enrolledSchemes: [String],
    currentHospital: { type: String, required: true },
    followUpCallsReceived: { type: Number, default: 0 },
    missedAppointments: { type: Number, default: 0 },
    daysSinceLastVisit: { type: Number, default: 0 },
    hospitalDelayDays: { type: Number, default: 0 },
    medicalHistory: [medicalHistorySchema],
    appointments: [appointmentSchema],
    riskAssessments: [riskAssessmentSchema],
    latestRiskLevel: { type: String, default: "Unknown" },
    latestRiskProbability: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

function generatePatientId() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `PAT-${digits}`;
}

patientSchema.pre('validate', function(next) {
  if (!this.patientId) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    this.patientId = `PAT-${randomDigits}`;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
