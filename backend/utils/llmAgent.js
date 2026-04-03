const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeWithLLM(message) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a medical triage assistant.

Classify the user's condition into:
- EMERGENCY
- MODERATE
- LOW

Also give a short reason.

Respond in JSON format:
{
  "level": "...",
  "reason": "..."
}
`
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    const text = response.choices[0].message.content;

    return JSON.parse(text);

  } catch (err) {
    console.log("LLM Error:", err);
    return { level: "LOW", reason: "Fallback response" };
  }
}

module.exports = { analyzeWithLLM };