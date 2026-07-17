import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set. AI features will fallback to simulation.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// REST API for Syncy AI Assistant
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, profile } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        text: `Hey! I'm Syncy, your SkillSync AI Assistant. I notice that the GEMINI_API_KEY is not currently configured, but I can still simulate a friendly response! You mentioned: "${message}". In a fully connected setup, I would analyze your profile (${profile?.name || "User"}) to recommend custom matches and learning paths!`
      });
    }

    const ai = getGemini();
    
    // Construct instructions context
    const profileContext = profile 
      ? `User Profile:\n- Name: ${profile.name}\n- College: ${profile.college}\n- Skills Offered: ${profile.skillsOffered?.join(", ") || "None"}\n- Skills Wanted: ${profile.skillsWanted?.join(", ") || "None"}\n- Experience Level: ${profile.experience}\n- Interests: ${profile.interests || "None"}\n- Goals: ${profile.learningGoals || "None"}`
      : "User Profile: Not yet fully completed onboarding.";

    const systemInstruction = `You are Syncy, a brilliant, friendly, and supportive peer-to-peer career mentor and skill matchmaker on the SkillSync platform.
Your goals:
1. Help users discover the best learning roadmaps for their desired skills.
2. Provide career advice, resume tips, and learning roadmaps.
3. Suggest skills they could offer or learn next.
4. Help them refine their bio or profile headlines to attract better matches.
5. Provide match recommendations or icebreaker lines for peer exchanges.

Keep your tone engaging, motivational, direct, and conversational (like a tech-startup mentor). Avoid robotic intro/outro phrases.
Format your responses using clean Markdown structure (bullet points, bolding, simple lists).

Here is the context of the user you are chatting with:
${profileContext}`;

    // Convert client-supplied history to contents structure for the SDK
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: { role: string; text: string }) => {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      });
    }
    
    // Append the current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/chat:", error);
    res.status(500).json({ error: "Something went wrong. Let's try again in a moment!", details: error.message });
  }
});

// Endpoint for Syncy to generate Profile copy (bios, headlines, or suggestions)
app.post("/api/ai/generate-profile", async (req, res) => {
  try {
    const { skillsOffered, skillsWanted, experience, interests, promptType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return simulated bio/headline
      if (promptType === "bio") {
        return res.json({
          text: `Passionate enthusiast ready to exchange skills on SkillSync! I am eager to share my knowledge in ${skillsOffered?.join(", ") || "my fields"} and looking forward to learning ${skillsWanted?.join(", ") || "new tools"}. Let's collaborate, build projects, and grow together!`
        });
      } else {
        return res.json({
          text: `Exchanging ${skillsOffered?.[0] || "skills"} for ${skillsWanted?.[0] || "knowledge"} | Let's sync!`
        });
      }
    }

    const ai = getGemini();
    let prompt = "";
    if (promptType === "bio") {
      prompt = `Generate a modern, highly compelling, human-sounding personal bio (approx 100-150 words) for a professional or student profile.
Details:
- Skills Offered: ${skillsOffered?.join(", ") || "None"}
- Skills Wanted: ${skillsWanted?.join(", ") || "None"}
- Experience Level: ${experience || "Enthusiast"}
- Interests: ${interests || "General learning"}

The bio should be written in the first person, look warm and active, and explicitly mention peer-to-peer exchange and building real projects. Return ONLY the plain text of the bio, no quotes or intro phrases.`;
    } else {
      prompt = `Generate 3 options for a short, punchy, modern profile headline (one liner, max 80 chars) for a peer skill-exchanger.
Details:
- Skills Offered: ${skillsOffered?.join(", ") || "None"}
- Skills Wanted: ${skillsWanted?.join(", ") || "None"}
- Experience: ${experience || "Enthusiast"}

Provide ONLY the headlines, one per line, formatted with numbers (e.g. "1. Headline").`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional resume writer and copywriter specializing in tech startup branding.",
        temperature: 0.8,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/ai/generate-profile:", error);
    res.status(500).json({ error: "Failed to generate copywriting options." });
  }
});

// Configure Vite middleware in development or static hosting in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillSync dev server running on http://localhost:${PORT}`);
  });
}

startServer();
