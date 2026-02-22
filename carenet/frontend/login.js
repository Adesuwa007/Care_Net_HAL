export default function handler(req, res) {
  const { username, password } = req.body || {};

  if (
    (username === "admin" && password === "carenet2026") ||
    (username === "doctor" && password === "doctor123")
  ) {
    return res.status(200).json({
      success: true,
      role: username,
      token: "demo-jwt-token"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });
}
