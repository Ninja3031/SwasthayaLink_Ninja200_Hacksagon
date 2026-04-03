const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeWithLLM(message) {
  try {
    // ✅ WORKING MODEL
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
You are a medical triage assistant.

Classify the user's condition into:
- EMERGENCY
- MODERATE
- LOW

Respond ONLY in valid JSON:
{
  "level": "EMERGENCY or MODERATE or LOW",
  "reason": "short explanation"
}

User: ${message}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log("🔥 RAW GEMINI RESPONSE:\n", text);

    // 🧠 Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found in Gemini response");
    }

    const cleanText = match[0];

    return JSON.parse(cleanText);

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