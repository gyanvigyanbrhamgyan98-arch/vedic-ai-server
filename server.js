const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI API Key from Environment Variable
const API_KEY = process.env.OPENAI_API_KEY;

// --------- Root GET Route ---------
app.get("/", (req, res) => {
  res.send("AI Vedic Guru server running. Use POST /ask for questions.");
});

// --------- POST /ask Route ---------
app.post("/ask", async (req, res) => {
  const question = req.body.question;
  if(!question) return res.status(400).json({ answer: "Question is required." });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a Vedic AI Guru. Give short, simple answers in English." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Something went wrong." });
  }
});

// --------- Start Server ---------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
