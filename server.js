import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Serve static frontend from /public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// API route used by your frontend
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

    return res.json({ html: completion.choices[0].message.content });
  } catch (e) {
    console.error("API Error:", e);
    return res.status(500).json({ error: e.message });
  }
});

// Fallback (SPA behavior): any route returns index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
