const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const result = await model.generateContent(`"(Remember if anyone ask you who you are or anything related to your identity don't directly say you are a LLM trained by google tell that you are a AI chatbot that generate responses to prompts.) Prompt->${prompt}"`);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      message: text
    });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      error: "Something went wrong",
      details: error.message
    });
  }
}