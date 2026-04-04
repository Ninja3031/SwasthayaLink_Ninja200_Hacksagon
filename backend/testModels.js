const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.listModels();

    console.log("✅ AVAILABLE MODELS:\n");

    models.forEach((model) => {
      console.log(model.name);
    });

  } catch (err) {
    console.log("❌ ERROR:", err.message);
  }
}

listModels();