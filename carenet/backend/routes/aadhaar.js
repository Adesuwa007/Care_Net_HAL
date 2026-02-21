const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /api/aadhaar/scan
// Accepts: { image: "base64string", mediaType: "image/jpeg" }
// Returns: extracted patient fields
router.post("/scan", async (req, res) => {
  const { image, mediaType } = req.body;

  if (!image) {
    return res.status(400).json({ error: "No image provided" });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(400).json({
      error:
        "Aadhaar scanning requires a Gemini API key. Please add GEMINI_API_KEY to your backend .env file, or enter patient details manually.",
    });
  }

  const mimeType = mediaType || "image/jpeg";

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: image,
                },
              },
              {
                text: `This is an Aadhaar card image. Extract the following fields and return ONLY a valid JSON object with no explanation, no markdown, no backticks:
{
  "name": "full name as printed",
  "dob": "date of birth in DD/MM/YYYY format or empty string",
  "gender": "Male or Female or Other",
  "aadhaarLast4": "last 4 digits of aadhaar number only",
  "address": "full address as printed or empty string"
}
If a field cannot be read, use empty string. Return only the JSON.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      }
    );

    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Safely parse JSON — strip any accidental markdown
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const extracted = JSON.parse(cleaned);

    // Calculate approximate age from DOB if available
    if (extracted.dob) {
      const parts = extracted.dob.split("/");
      if (parts.length === 3) {
        const birthYear = parseInt(parts[2]);
        const currentYear = new Date().getFullYear();
        extracted.age = currentYear - birthYear;
      }
    }

    res.json(extracted);
  } catch (err) {
    console.error("Aadhaar scan error:", err?.response?.data || err.message);
    res.status(500).json({
      error:
        "Could not extract data from image. Please fill in the details manually.",
    });
  }
});

module.exports = router;
