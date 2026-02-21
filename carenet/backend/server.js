require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/auth");
const patientsRouter = require("./routes/patients");
const schemesRouter = require("./routes/schemes");
const transferRouter = require("./routes/transfer");
const analyticsRouter = require("./routes/analytics");
const logsRouter = require("./routes/logs");

const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Public routes (no auth required)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/aadhaar", require("./routes/aadhaar"));

// Health check (public)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Protected routes (require valid JWT)
app.use(authMiddleware);
app.use(patientsRouter);
app.use(schemesRouter);
app.use(transferRouter);
app.use(analyticsRouter);
app.use("/api/logs", logsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`CARE-NET Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

