require("dotenv").config();
const mongoose = require("mongoose");
const Patient = require("./models/Patient");
const { predictRisk } = require("./mlClient");

const seedPatients = [
  {
    name: "Ramesh Kumar",
    age: 34,
    gender: "Male",
    phone: "9876543210",
    disease: "TB",
    treatmentStage: 3,
    financialScore: 7,
    schemeEnrolled: true,
    enrolledSchemes: ["Nikshay Poshan Yojana (₹500/month)"],
    currentHospital: "AIIMS Delhi",
    followUpCallsReceived: 4,
    missedAppointments: 0,
    daysSinceLastVisit: 14,
    hospitalDelayDays: 3,
    appointments: [
      ...Array(6).fill(null).map((_, i) => ({
        date: new Date(Date.now() - (6 - i) * 14 * 24 * 60 * 60 * 1000),
        type: "follow-up",
        status: "completed",
        notes: "",
      })),
    ],
    medicalHistory: [],
  },
  {
    name: "Priya Sharma",
    age: 28,
    gender: "Female",
    phone: "9876543211",
    disease: "Maternal Care",
    treatmentStage: 2,
    financialScore: 5,
    schemeEnrolled: false,
    enrolledSchemes: [],
    currentHospital: "RML Hospital Delhi",
    followUpCallsReceived: 1,
    missedAppointments: 2,
    daysSinceLastVisit: 35,
    hospitalDelayDays: 7,
    appointments: [
      ...Array(3).fill(null).map((_, i) => ({
        date: new Date(Date.now() - (3 - i) * 21 * 24 * 60 * 60 * 1000),
        type: "antenatal",
        status: "completed",
        notes: "",
      })),
      { date: new Date(), type: "checkup", status: "missed", notes: "" },
      { date: new Date(), type: "checkup", status: "missed", notes: "" },
    ],
    medicalHistory: [],
  },
  {
    name: "Mohammed Iqbal",
    age: 45,
    gender: "Male",
    phone: "9876543212",
    disease: "Diabetes",
    treatmentStage: 1,
    financialScore: 2,
    schemeEnrolled: false,
    enrolledSchemes: [],
    currentHospital: "Victoria Hospital Bengaluru",
    followUpCallsReceived: 0,
    missedAppointments: 5,
    daysSinceLastVisit: 95,
    hospitalDelayDays: 10,
    appointments: [
      { date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), type: "consultation", status: "completed", notes: "" },
      { date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), type: "follow-up", status: "completed", notes: "" },
      ...Array(5).fill(null).map(() => ({ date: new Date(), type: "checkup", status: "missed", notes: "" })),
    ],
    medicalHistory: [
      { hospital: "Bowring Hospital Bengaluru", diagnosis: "Diabetes Type 2", treatment: "Metformin", doctor: "Dr. Rao", date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), notes: "Referred to Victoria Hospital" },
    ],
  },
  {
    name: "Lakshmi Devi",
    age: 62,
    gender: "Female",
    phone: "9876543213",
    disease: "Hypertension",
    treatmentStage: 2,
    financialScore: 3,
    schemeEnrolled: false,
    enrolledSchemes: [],
    currentHospital: "KC General Bengaluru",
    followUpCallsReceived: 0,
    missedAppointments: 4,
    daysSinceLastVisit: 60,
    hospitalDelayDays: 12,
    appointments: [
      { date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), type: "consultation", status: "completed", notes: "" },
      ...Array(4).fill(null).map(() => ({ date: new Date(), type: "checkup", status: "missed", notes: "" })),
    ],
    medicalHistory: [],
  },
  {
    name: "Arjun Patel",
    age: 29,
    gender: "Male",
    phone: "9876543214",
    disease: "TB",
    treatmentStage: 4,
    financialScore: 8,
    schemeEnrolled: true,
    enrolledSchemes: ["Nikshay Poshan Yojana (₹500/month)", "Ayushman Bharat PM-JAY"],
    currentHospital: "Rajiv Gandhi Hospital Bengaluru",
    followUpCallsReceived: 6,
    missedAppointments: 0,
    daysSinceLastVisit: 7,
    hospitalDelayDays: 2,
    appointments: [
      ...Array(8).fill(null).map((_, i) => ({
        date: new Date(Date.now() - (8 - i) * 10 * 24 * 60 * 60 * 1000),
        type: "DOTS",
        status: "completed",
        notes: "",
      })),
    ],
    medicalHistory: [],
  },
];

async function runAssessment(patient) {
  try {
    return await predictRisk(patient);
  } catch (e) {
    return null;
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await Patient.countDocuments({});
  if (existing > 0) {
    console.log("Database already has patients. Skipping seed. (Delete existing data to re-seed.)");
    await mongoose.disconnect();
    process.exit(0);
    return;
  }
  for (const data of seedPatients) {
    const patient = new Patient(data);
    await patient.save();
    const result = await runAssessment(patient);
    if (result) {
      patient.latestRiskLevel = result.risk_level;
      patient.latestRiskProbability = result.risk_probability;
      patient.riskAssessments = [{
        assessedAt: new Date(),
        riskLevel: result.risk_level,
        riskProbability: result.risk_probability,
        primaryReasons: result.primary_reasons || [],
        recommendation: result.recommendation || "",
      }];
    } else {
      if (data.name === "Ramesh Kumar" || data.name === "Arjun Patel") {
        patient.latestRiskLevel = "Low";
        patient.latestRiskProbability = 15;
        patient.riskAssessments = [{ assessedAt: new Date(), riskLevel: "Low", riskProbability: 15, primaryReasons: [], recommendation: "Continue regular monitoring." }];
      } else if (data.name === "Priya Sharma") {
        patient.latestRiskLevel = "Medium";
        patient.latestRiskProbability = 52;
        patient.riskAssessments = [{ assessedAt: new Date(), riskLevel: "Medium", riskProbability: 52, primaryReasons: ["Multiple missed appointments"], recommendation: "Schedule follow-up within 7 days." }];
      } else {
        patient.latestRiskLevel = "High";
        patient.latestRiskProbability = 88;
        patient.riskAssessments = [{ assessedAt: new Date(), riskLevel: "High", riskProbability: 88, primaryReasons: ["Multiple missed appointments", "Financial barrier with no scheme support"], recommendation: "Immediate intervention required." }];
      }
    }
    await patient.save();
    console.log("Seeded:", patient.name, patient.patientId, patient.latestRiskLevel);
  }
  console.log("Seed complete. 5 patients added.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
