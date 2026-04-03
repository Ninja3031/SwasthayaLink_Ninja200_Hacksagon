require("dotenv").config();

const express = require("express");
const app = express();

// Agents
const { detectEmergency } = require("./utils/emergencyAgent");
const { analyzeWithLLM } = require("./utils/llmAgent");

// Middleware
app.use(express.json());

// ✅ Test route
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send("Working!");
});

// ✅ Main chat route
app.post("/chat", async (req, res) => {
  console.log("----- NEW REQUEST -----");

  const { message } = req.body;
  console.log("Received message:", message);

  // ❌ No message
  if (!message) {
    return res.json({
      type: "error",
      reply: "No message provided"
    });
  }

  // 🚨 Rule-based emergency check (fast)
  if (detectEmergency(message)) {
    console.log("🚨 Emergency detected (rule-based)");

    return res.json({
      type: "emergency",
      reply: "🚨 This may be a medical emergency. Please go to hospital immediately."
    });
  }

  // 🧠 Gemini LLM reasoning
  const result = await analyzeWithLLM(message);

  console.log("LLM Result:", result);

  // 🚨 Emergency (LLM)
  if (result.level === "EMERGENCY") {
    return res.json({
      type: "emergency",
      reply: `🚨 ${result.reason}`
    });
  }

  // ⚠️ Moderate
  if (result.level === "MODERATE") {
    return res.json({
      type: "warning",
      reply: `⚠️ ${result.reason}`
    });
  }

  // ✅ Low
  return res.json({
    type: "normal",
    reply: `✅ ${result.reason}`
  });
});

// ✅ Start server
app.listen(5001, () => {
  console.log("🚀 Server running on port 5001");
});