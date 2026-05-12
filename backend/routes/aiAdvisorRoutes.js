const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "AI Advisor route working",
  });
});

router.post("/diagnose", upload.single("image"), (req, res) => {
  const { cropName, symptoms, location } = req.body;

  res.json({
    success: true,
    result: `
🌱 AI Crop Advisor Result

Crop: ${cropName || "Not provided"}
Location: ${location || "Not provided"}
Symptoms: ${symptoms || "Not provided"}

Possible Issue:
General crop stress or disease symptoms detected.

Advice:
Check leaves carefully, avoid overwatering, remove affected leaves, and use neem oil spray.

Note:
This is free demo mode. No paid API used.
    `,
  });
});

module.exports = router;