require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const patientsRouter = require("./routes/patients");
const schemesRouter = require("./routes/schemes");
const transferRouter = require("./routes/transfer");
const analyticsRouter = require("./routes/analytics");

const app = express();
const PORT = process.env.PORT || 5002;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(patientsRouter);
app.use(schemesRouter);
app.use(transferRouter);
app.use(analyticsRouter);

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
