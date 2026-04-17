const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_TOKEN);

const app = express();
app.use(express.json());
app.use(cors());

app.post("/message", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    
    if (!userPrompt) {
      return res.status(400).send({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    res.send({
      message: text
    });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).send({
      error: "Something went wrong",
      details: error.message
    });
  }
});

module.exports = app;

