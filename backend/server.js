require("dotenv").config();
const { analyzeWithLLM } = require("./utils/llmAgent.js");
const express = require("express");
const app = express();

const { detectEmergency } = require("./utils/emergencyAgent");

// Middleware
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send("Working!");
});

// Main chat route
app.post("/chat", async (req, res) => {
  console.log("----- NEW REQUEST -----");

  const { message } = req.body;
  console.log("Received message:", message);

  if (!message) {
    return res.json({
      type: "error",
      reply: "No message provided"
    });
  }

  // Emergency check
  if (detectEmergency(message)) {
    console.log("🚨 Emergency detected!");

    return res.json({
      type: "emergency",
      reply: "🚨 This may be a medical emergency. Please go to hospital immediately."
    });
  }

  // LLM reasoning
  const result = await analyzeWithLLM(message);

  console.log("LLM Result:", result);

  if (result.level === "EMERGENCY") {
    return res.json({
      type: "emergency",
      reply: `🚨 ${result.reason}`
    });
  }

  if (result.level === "MODERATE") {
    return res.json({
      type: "warning",
      reply: `⚠️ ${result.reason}`
    });
  }

  return res.json({
    type: "normal",
    reply: `✅ ${result.reason}`
  });
});

// Start server
app.listen(5001, () => {
  console.log("🚀 Server running on port 5001");
});