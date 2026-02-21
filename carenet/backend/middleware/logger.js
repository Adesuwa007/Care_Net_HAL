const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            "LOGIN",
            "LOGOUT",
            "PATIENT_CREATED",
            "PATIENT_UPDATED",
            "RISK_ASSESSED",
            "RECORD_TRANSFERRED",
            "SCHEME_ENROLLED",
            "PDF_GENERATED",
            "AADHAAR_SCANNED",
            "PAGE_VISIT",
        ],
        required: true,
    },
    username: { type: String, default: "system" },
    role: { type: String, default: "" },
    description: { type: String, required: true },
    patientId: { type: String, default: null },
    patientName: { type: String, default: null },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    status: {
        type: String,
        enum: ["SUCCESS", "FAILURE", "WARNING"],
        default: "SUCCESS",
    },
    timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);

// Utility function to create a log entry
const createLog = async (logData) => {
    try {
        const log = new Log(logData);
        await log.save();
    } catch (err) {
        console.error("Logging error:", err.message);
    }
};

module.exports = { Log, createLog };
