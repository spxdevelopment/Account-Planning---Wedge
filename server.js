import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("SalesSparx backend is running.");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, model = "gpt-4o-mini" } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are a senior enterprise sales strategist." },
        { role: "user", content: prompt }
      ]
    });

    res.json({ html: completion.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
