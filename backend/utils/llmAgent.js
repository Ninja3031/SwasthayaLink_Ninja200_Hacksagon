const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeWithLLM(message) {
  try {
    const model = genAI.getGenerativeModel({
  model: "gemini-flash-lite-latest"
});

    const prompt = `
You are a medical triage assistant.

Classify the user's condition into:
- EMERGENCY
- MODERATE
- LOW

Respond ONLY in JSON:
{
  "level": "EMERGENCY or MODERATE or LOW",
  "reason": "short explanation"
}

User: ${message}
`;

    console.log("📤 Sending to Gemini...");

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log("🔥 RAW GEMINI RESPONSE:\n", text);

    // Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found");
    }

    const parsed = JSON.parse(match[0]);

    console.log("✅ PARSED:", parsed);

    return parsed;

  } catch (err) {
    console.log("❌ GEMINI ERROR FULL:", err);
    console.log("❌ GEMINI MESSAGE:", err.message);

    return {
      level: "LOW",
      reason: "Fallback response"
    };
  }
}

module.exports = { analyzeWithLLM };