export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body || {};

  if (
    (username === "admin" && password === "carenet2026") ||
    (username === "doctor" && password === "doctor123")
  ) {
    return res.status(200).json({
      token: "demo-jwt-token",
      user: {
        username,
        role: username === "admin" ? "admin" : "doctor"
      }
    });
  }

  return res.status(401).json({
    message: "Invalid username or password"
  });
}
