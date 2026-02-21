const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: { username: user.username, role: user.role, hospital: user.hospital }
  });
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