const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createLog } = require("../middleware/logger");

// Hardcode two users for hackathon (no user registration needed)
const USERS = [
  {
    id: 1,
    username: "admin",
    // password: "carenet2026"
    passwordHash: bcrypt.hashSync("carenet2026", 10),
    role: "Admin",
    hospital: "All Hospitals"
  },
  {
    id: 2,
    username: "doctor",
    // password: "doctor123"
    passwordHash: bcrypt.hashSync("doctor123", 10),
    role: "Doctor",
    hospital: "AIIMS Delhi"
  }
];

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    await createLog({
      type: "LOGIN",
      username: req.body.username || "unknown",
      description: `Failed login attempt for username: ${req.body.username}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      status: "FAILURE"
    });
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  await createLog({
    type: "LOGIN",
    username: user.username,
    role: user.role,
    description: `User ${user.username} logged in successfully`,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    status: "SUCCESS"
  });

  res.json({
    token,
    user: { username: user.username, role: user.role, hospital: user.hospital }
  });
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
  const { username, role } = req.body;
  await createLog({
    type: "LOGOUT",
    username: username || "unknown",
    role: role || "",
    description: `User ${username || "unknown"} logged out`,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    status: "SUCCESS"
  });
  res.json({ message: "Logged out" });
});

// GET /api/auth/verify
router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;